use crate::ctx::Ctx;
use crate::generate_common_bmc_fns;
use crate::model::base::{self, DbBmc};
use crate::model::modql_utils::time_to_sea_value;
use crate::model::ModelManager;
use crate::model::Result;
use lib_utils::time::Rfc3339;
use modql::field::Fields;
use modql::filter::{
    FilterNodes, ListOptions, OpValsInt64, OpValsString, OpValsValue,
};
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use sqlx::types::time::OffsetDateTime;
use sqlx::FromRow;

// region:    --- Journal Types

/// Trait to implement on entities that have a journal_id
/// This will allow Ctx to be upgraded with the corresponding journal_id for
/// future access control.
pub trait JournalScoped {
    fn journal_id(&self) -> i64;
}

#[serde_as]
#[derive(Debug, Clone, Fields, FromRow, Serialize)]
pub struct Journal {
    pub id: i64,

    // -- Relations
    pub user_id: i64,

    // -- Properties
    pub title: Option<String>,
    pub description: Option<String>,

    // -- Timestamps
    // creator user_id and time
    pub cid: i64,
    #[serde_as(as = "Rfc3339")]
    pub ctime: OffsetDateTime,
    // last modifier user_id and time
    pub mid: i64,
    #[serde_as(as = "Rfc3339")]
    pub mtime: OffsetDateTime,
}

#[derive(Fields, Deserialize, Default)]
pub struct JournalForCreate {
    pub title: Option<String>,
    pub user_id: i64,
    pub description: Option<String>,
}

#[derive(Fields, Deserialize, Default)]
pub struct JournalForUpdate {
    pub title: Option<String>,
    pub description: Option<String>,
}

#[derive(FilterNodes, Deserialize, Default, Debug)]
pub struct JournalFilter {
    pub id: Option<OpValsInt64>,

    pub user_id: Option<OpValsInt64>,

    pub title: Option<OpValsString>,
    pub description: Option<OpValsString>,

    pub cid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub ctime: Option<OpValsValue>,
    pub mid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub mtime: Option<OpValsValue>,
}

// endregion: --- Journal Types

// region:    --- JournalBmc

pub struct JournalBmc;

impl DbBmc for JournalBmc {
    const TABLE: &'static str = "journal";

    fn requires_user_specific_access() -> bool { true }
}

// This will generate the `impl JournalBmc {...}` with the default CRUD functions.
generate_common_bmc_fns!(
	Bmc: JournalBmc,
	Entity: Journal,
	ForCreate: JournalForCreate,
	ForUpdate: JournalForUpdate,
	Filter: JournalFilter
);

// Additional JournalBmc methods to manage the `JournalMsg` constructs.
// impl JournalBmc {
    /// Add a `Trade` to a `Journal`
    ///
    // For access constrol, we will add:
    // #[ctx_add(conv, space)]
    // #[requires_privilege_any_of("og:FullAccess", "sp:FullAccess", "conv@owner_id" "conv:AddMsg")]
    // pub async fn add_msg(
    //     ctx: &Ctx,
    //     mm: &ModelManager,
    //     msg_c: ConvMsgForCreate,
    // ) -> Result<i64> {
    //     let msg_i = ConvMsgForInsert::from_msg_for_create(ctx.user_id(), msg_c);
    //     let conv_msg_id = base::create::<ConvMsgBmc, _>(ctx, mm, msg_i).await?;
    //
    //     Ok(conv_msg_id)
    // }

    /// NOTE: The current strategy is to not require conv_id, but we will check
    ///       that user have `conv:ReadMsg` privilege on correponding conv (post base::get).
    // pub async fn get_msg(
    //     ctx: &Ctx,
    //     mm: &ModelManager,
    //     msg_id: i64,
    // ) -> Result<ConvMsg> {
    //     let conv_msg: ConvMsg = base::get::<ConvMsgBmc, _>(ctx, mm, msg_id).await?;
    //
    //     // TODO: Validate conv_msg is with ctx.conv_id
    //     //       let _ctx = ctx.add_conv_id(conv_msg.conv_id());
    //     //       assert_privileges(&ctx, &mm, &["conv@owner_id", "conv:ReadMsg"]);
    //
    //     Ok(conv_msg)
    // }
// }

// endregion: --- JournalBmc

// region:    --- Tests

#[cfg(test)]
mod tests {
    type Error = Box<dyn std::error::Error>;
    type Result<T> = core::result::Result<T, Error>; // For tests.

    use super::*;
    use crate::_dev_utils::{self};
    use crate::ctx::Ctx;
    use serial_test::serial;

    #[serial]
    #[tokio::test]
    async fn test_create_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_title = "test_create_ok journal 01";
        let fx_description = "test_create_ok journal description";

        // -- Exec
        let journal_id = JournalBmc::create(
            &ctx,
            &mm,
            JournalForCreate {
                title: Some(fx_title.to_string()),
                user_id: ctx.user_id(),
                description: Some(fx_description.to_string()),
            },
        )
            .await?;

        // -- Check
        let journal: Journal = JournalBmc::get(&ctx, &mm, journal_id).await?;
        assert_eq!(journal.title.ok_or("journal should have title")?, fx_title);
        assert_eq!(journal.description.ok_or("journal should have title")?, fx_description);

        // -- Clean
        JournalBmc::delete(&ctx, &mm, journal_id).await?;

        Ok(())
    }

    #[serial]
    #[tokio::test]
    async fn test_list_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_title_prefix = "test_list_ok journal - ";
        let fx_description_prefix = "test_list_ok journal description- ";

        for i in 1..=6 {
            let _journal_id = JournalBmc::create(
                &ctx,
                &mm,
                JournalForCreate {
                    title: Some(format!("{fx_title_prefix}{:<02}", i)),
                    user_id: ctx.user_id(),
                    description: Some(format!("{fx_description_prefix}{:<02}", i)),
                },
            )
                .await?;
        }

        // -- Exec
        let journals = JournalBmc::list(
            &ctx,
            &mm,
            Some(vec![JournalFilter {
                ..Default::default()
            }]),
            None,
        )
            .await?;

        // -- Check
        // extract the 04, 05, 06 parts of the tiles
        let num_parts = journals
            .iter()
            .filter_map(|j| j.title.as_ref().and_then(|s| s.split("- ").nth(1)))
            .collect::<Vec<&str>>();
        assert_eq!(num_parts, &["01", "02", "03", "04", "05", "06"]);

        // -- Clean
        // This should delete cascade
        // TODO delete all journals
        // JournalBmc::delete(&ctx, &mm, agent_id).await?;

        Ok(())
    }
}

// endregion: --- Tests

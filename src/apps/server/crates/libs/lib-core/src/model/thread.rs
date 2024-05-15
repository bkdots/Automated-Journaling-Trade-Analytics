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

/// Trait to implement on entities that have a thread_id
/// This will allow Ctx to be upgraded with the corresponding thread_id for
/// future access control.
pub trait ThreadScoped {
    fn thread_id(&self) -> i64;
}

#[serde_as]
#[derive(Debug, Clone, Fields, FromRow, Serialize)]
pub struct Thread {
    pub id: i64,

    // -- Relations
    pub user_id: i64,
    pub trade_id: i64,

    // -- Properties
    pub content: Option<String>,
    pub image_id: Option<String>,
    pub image_link: Option<String>,

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
pub struct ThreadForCreate {
    pub user_id: i64,
    pub trade_id: i64,

    pub content: Option<String>,
    pub image_id: Option<String>,
    pub image_link: Option<String>,
}

#[derive(Fields, Deserialize, Default)]
pub struct ThreadForUpdate {
    pub content: Option<String>,
    pub image_id: Option<String>,
    pub image_link: Option<String>,
}

#[derive(FilterNodes, Deserialize, Default, Debug)]
pub struct ThreadFilter {
    pub id: Option<OpValsInt64>,

    pub user_id: Option<OpValsInt64>,
    pub trade_id: Option<OpValsInt64>,

    pub content: Option<OpValsString>,
    pub image_id: Option<OpValsString>,
    pub image_link: Option<OpValsString>,

    pub cid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub ctime: Option<OpValsValue>,
    pub mid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub mtime: Option<OpValsValue>,
}

// endregion: --- Journal Types

// region:    --- JournalBmc

pub struct ThreadBmc;

impl DbBmc for ThreadBmc {
    const TABLE: &'static str = "thread";
}

// This will generate the `impl ThreadBmc {...}` with the default CRUD functions.
generate_common_bmc_fns!(
	Bmc: ThreadBmc,
	Entity: Thread,
	ForCreate: ThreadForCreate,
	ForUpdate: ThreadForUpdate,
	Filter: ThreadFilter
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
    use modql::filter::OpValString;
    use serial_test::serial;

    #[serial]
    #[tokio::test]
    async fn test_create_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_content = "test_create_ok thread 01";
        let fx_image_id = "test_create_ok image id 01";
        let fx_image_link = "test_create_ok image link 01";

        // -- Exec
        let thread_id = ThreadBmc::create(
            &ctx,
            &mm,
            ThreadForCreate {
                user_id: ctx.user_id(),
                trade_id: 2,
                content: Some(fx_content.to_string()),
                image_id: Some(fx_image_id.to_string()),
                image_link: Some(fx_image_link.to_string()),
            },
        )
            .await?;

        // -- Check
        let thread: Thread = ThreadBmc::get(&ctx, &mm, thread_id).await?;
        assert_eq!(thread.content.ok_or("thread should have content")?, fx_content);
        assert_eq!(thread.image_id.ok_or("thread should have image id")?, fx_image_id);
        assert_eq!(thread.image_link.ok_or("thread should have image link")?, fx_image_link);

        // -- Clean
        ThreadBmc::delete(&ctx, &mm, thread_id).await?;

        Ok(())
    }

    #[serial]
    #[tokio::test]
    async fn test_list_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_content_prefix = "test_list_ok thread content - ";
        let fx_image_id_prefix = "test_list_ok thread image id - ";
        let fx_image_link_prefix = "test_list_ok thread image link - ";

        for i in 1..=6 {
            let _thread_id = ThreadBmc::create(
                &ctx,
                &mm,
                ThreadForCreate {
                    user_id: ctx.user_id(),
                    trade_id: 1,
                    content: Some(format!("{fx_content_prefix}{:<02}", i)),
                    image_id: Some(format!("{fx_image_id_prefix}{:<02}", i)),
                    image_link: Some(format!("{fx_image_link_prefix}{:<02}", i)),
                },
            )
                .await?;
        }

        // -- Exec
        let threads = ThreadBmc::list(
            &ctx,
            &mm,
            Some(vec![ThreadFilter {
                // thread_type: Some(OpValString::In(vec!["Entry".to_string()]).into()),
                // or
                // kind: Some(OpValString::Eq("MultiUsers".to_string()).into()),
                ..Default::default()
            }]),
            None,
        )
            .await?;

        // -- Check
        // extract the 04, 05, 06 parts of the tiles
        let num_parts = threads
            .iter()
            .filter_map(|c| c.content.as_ref().and_then(|s| s.split("- ").nth(1)))
            .collect::<Vec<&str>>();
        assert_eq!(num_parts, &["01", "02", "03", "04", "05", "06"]);

        // -- Clean
        // This should delete cascade
        // AgentBmc::delete(&ctx, &mm, agent_id).await?;

        Ok(())
    }
}

// endregion: --- Tests
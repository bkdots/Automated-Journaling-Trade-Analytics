use crate::ctx::Ctx;
use crate::generate_common_bmc_fns;
use crate::model::base::{self, DbBmc};
use crate::model::modql_utils::time_to_sea_value;
use crate::model::ModelManager;
use crate::model::Result;
use lib_utils::time::Rfc3339;
use modql::field::Fields;
use modql::filter::{
    FilterNodes, ListOptions, OpValsInt64, OpValsValue
};
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use sqlx::types::time::OffsetDateTime;
use sqlx::FromRow;

// region:    --- Journal Types

/// Trait to implement on entities that have a tradetag_id
/// This will allow Ctx to be upgraded with the corresponding tradetag_id for
/// future access control.
pub trait TradeTagScoped {
    fn tradetag_id(&self) -> i64;
}

#[serde_as]
#[derive(Debug, Clone, Fields, FromRow, Serialize)]
pub struct TradeTag {
    // -- Relations
    pub trade_id: i64,
    pub tag_id: i64,

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
pub struct TradeTagForCreate {
    pub trade_id: i64,
    pub tag_id: i64,
}

#[derive(Fields, Deserialize, Default)]
pub struct TradeTagForUpdate {
    pub trade_id: i64,
    pub tag_id: i64,
}

#[derive(FilterNodes, Deserialize, Default, Debug)]
pub struct TradeTagFilter {
    pub trade_id: Option<OpValsInt64>,
    pub tag_id: Option<OpValsInt64>,

    pub cid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub ctime: Option<OpValsValue>,
    pub mid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub mtime: Option<OpValsValue>,
}

// endregion: --- Journal Types

// region:    --- JournalBmc

pub struct TradeTagBmc;

impl DbBmc for TradeTagBmc {
    const TABLE: &'static str = "trade_tag";

    fn requires_user_specific_access() -> bool { true }
}

// This will generate the `impl TradeTagBmc {...}` with the default CRUD functions.
generate_common_bmc_fns!(
	Bmc: TradeTagBmc,
	Entity: TradeTag,
	ForCreate: TradeTagForCreate,
	ForUpdate: TradeTagForUpdate,
	Filter: TradeTagFilter
);

// Additional JournalBmc methods to manage the `JournalMsg` constructs.
// impl JournalBmc {
/// Add a `TradeTag` to a `Journal`
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
        let fx_trade_id = 1;
        let fx_tag_id = 2;

        // -- Exec
        let tradetag_id = TradeTagBmc::create(
            &ctx,
            &mm,
            TradeTagForCreate {
                trade_id: 1,
                tag_id: 2,
            },
        )
            .await?;

        // -- Check
        let tradetag: TradeTag = TradeTagBmc::get(&ctx, &mm, tradetag_id).await?;
        assert_eq!(&tradetag.trade_id, &fx_trade_id);
        assert_eq!(&tradetag.tag_id, &fx_tag_id);

        // -- Clean
        TradeTagBmc::delete(&ctx, &mm, tradetag_id).await?;

        Ok(())
    }

    // #[serial]
    // #[tokio::test]
    // async fn test_list_ok() -> Result<()> {
    //     // -- Setup & Fixtures
    //     let mm = _dev_utils::init_test().await;
    //     let ctx = Ctx::root_ctx();
    //     let fx_trade_id_prefix = "test_create_ok trade name - ";
    //     let fx_tag_id_prefix = "test_create_ok description - ";
    //
    //     for i in 1..=6 {
    //         let _tradetag_id = TradeTagBmc::create(
    //             &ctx,
    //             &mm,
    //             TradeTagForCreate {
    //                 trade_id: 1,
    //                 tag_id: 1,
    //             },
    //         )
    //             .await?;
    //     }
    //
    //     // -- Exec
    //     let tradetags = TradeTagBmc::list(
    //         &ctx,
    //         &mm,
    //         Some(vec![TradeTagFilter {
    //             // tradetag_type: Some(OpValString::In(vec!["Entry".to_string()]).into()),
    //             // or
    //             // kind: Some(OpValString::Eq("MultiUsers".to_string()).into()),
    //             ..Default::default()
    //         }]),
    //         None,
    //     )
    //         .await?;
    //
    //     // -- Check
    //     // extract the 04, 05, 06 parts of the tiles
    //     let num_parts = tradetags
    //         .iter()
    //         .filter_map(|c| c.tradetag_name.as_ref().and_then(|s| s.split("- ").nth(1)))
    //         .collect::<Vec<&str>>();
    //     assert_eq!(num_parts, &["01", "02", "03"]);
    //
    //     // -- Clean
    //     // This should delete cascade
    //     // AgentBmc::delete(&ctx, &mm, agent_id).await?;
    //
    //     Ok(())
    // }
}

// endregion: --- Tests
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

// region:    --- Exchange Types

/// Trait to implement on entities that have a exchange_id
/// This will allow Ctx to be upgraded with the corresponding exchange_id for
/// future access control.
pub trait ExchangeScoped {
    fn exchange_id(&self) -> i64;
}

#[serde_as]
#[derive(Debug, Clone, Fields, FromRow, Serialize)]
pub struct Exchange {
    pub id: i64,

    // -- Properties
    pub exchange_name: Option<String>,
    pub image_id: Option<String>,
    pub exchange_referral: Option<String>,
    pub instruction: Option<String>,

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
pub struct ExchangeForCreate {
    pub exchange_name: Option<String>,
    pub image_id: Option<String>,
    pub exchange_referral: Option<String>,
    pub instruction: Option<String>,
}

#[derive(Fields, Deserialize, Default)]
pub struct ExchangeForUpdate {
    pub exchange_name: Option<String>,
    pub image_id: Option<String>,
    pub exchange_referral: Option<String>,
    pub instruction: Option<String>,
}

#[derive(FilterNodes, Deserialize, Default, Debug)]
pub struct ExchangeFilter {
    pub id: Option<OpValsInt64>,

    pub exchange_name: Option<OpValsString>,
    pub image_id: Option<OpValsString>,
    pub exchange_referral: Option<OpValsString>,
    pub instruction: Option<OpValsString>,

    pub cid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub ctime: Option<OpValsValue>,
    pub mid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub mtime: Option<OpValsValue>,
}

// endregion: --- Exchange Types

// region:    --- ExchangeBmc

pub struct ExchangeBmc;

impl DbBmc for ExchangeBmc {
    const TABLE: &'static str = "exchange";
}

// This will generate the `impl ExchangeBmc {...}` with the default CRUD functions.
generate_common_bmc_fns!(
	Bmc: ExchangeBmc,
	Entity: Exchange,
	ForCreate: ExchangeForCreate,
	ForUpdate: ExchangeForUpdate,
	Filter: ExchangeFilter
);

// TODO hash the secret
// TODO check if its a referral api key
// Additional ExchangeBmc methods to manage the `ExchangeMsg` constructs.
// impl ExchangeBmc {
/// Add a `Trade` to a `Exchange`
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

// endregion: --- ExchangeBmc

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
        let fx_exchange_name = "test_create_ok exchange name";
        let fx_image_id = "test_create_ok image id";
        let fx_exchange_referral = "test_create_ok exchange referral";
        let fx_instruction = "test_create_ok instructions";

        // -- Exec
        let exchange_id = ExchangeBmc::create(
            &ctx,
            &mm,
            ExchangeForCreate {
                exchange_name: Some(fx_exchange_name.to_string()),
                image_id: Some(fx_image_id.to_string()),
                exchange_referral: Some(fx_exchange_referral.to_string()),
                instruction: Some(fx_instruction.to_string()),
            },
        )
            .await?;

        // -- Check
        let exchange: Exchange = ExchangeBmc::get(&ctx, &mm, exchange_id).await?;
        assert_eq!(exchange.exchange_name.ok_or("exchange should have exchange name")?, fx_exchange_name);
        assert_eq!(exchange.image_id.ok_or("exchange should have image id")?, fx_image_id);
        assert_eq!(exchange.exchange_referral.ok_or("exchange should have exchange referral")?, fx_exchange_referral);
        assert_eq!(exchange.instruction.ok_or("exchange should have instruction")?, fx_instruction);

        // -- Clean
        ExchangeBmc::delete(&ctx, &mm, exchange_id).await?;

        Ok(())
    }

    #[serial]
    #[tokio::test]
    async fn test_list_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_exchange_name_prefix = "test_create_ok exchange name - ";
        let fx_image_id_prefix = "test_create_ok image id - ";
        let fx_exchange_referral_prefix = "test_create_ok exchange referral - ";
        let fx_instruction_prefix = "test_create_ok instruction - ";

        for i in 1..=6 {
            let _exchange_id = ExchangeBmc::create(
                &ctx,
                &mm,
                ExchangeForCreate {
                    exchange_name: Some(format!("{fx_exchange_name_prefix}{:<02}", i)),
                    image_id: Some(format!("{fx_image_id_prefix}{:<02}", i)),
                    exchange_referral: Some(format!("{fx_exchange_referral_prefix}{:<02}", i)),
                    instruction: Some(format!("{fx_instruction_prefix}{:<02}", i)),
                },
            )
                .await?;
        }

        // -- Exec
        let exchanges = ExchangeBmc::list(
            &ctx,
            &mm,
            Some(vec![ExchangeFilter {
                ..Default::default()
            }]),
            None,
        )
            .await?;

        // -- Check
        // extract the 04, 05, 06 parts of the tiles
        let num_parts = exchanges
            .iter()
            .filter_map(|j| j.exchange_name.as_ref().and_then(|s| s.split("- ").nth(1)))
            .collect::<Vec<&str>>();
        assert_eq!(num_parts, &["01", "02", "03", "04", "05", "06"]);

        // -- Clean
        // This should delete cascade
        // TODO delete all exchanges
        // ExchangeBmc::delete(&ctx, &mm, agent_id).await?;

        Ok(())
    }
}

// endregion: --- Tests

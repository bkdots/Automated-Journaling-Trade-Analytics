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

// region:    --- ApiKey Types

/// Trait to implement on entities that have a apikey_id
/// This will allow Ctx to be upgraded with the corresponding apikey_id for
/// future access control.
pub trait ApiKeyScoped {
    fn apikey_id(&self) -> i64;
}

#[serde_as]
#[derive(Debug, Clone, Fields, FromRow, Serialize)]
pub struct ApiKey {
    pub id: i64,

    // -- Relations
    pub user_id: i64,
    pub exchange_id: i64,

    // -- Properties
    pub title: Option<String>,
    pub api_key_value: Option<String>,
    pub api_key_secret: Option<String>,
    pub api_referral: Option<bool>,

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
pub struct ApiKeyForCreate {
    pub user_id: i64,
    pub exchange_id: i64,
    pub title: Option<String>,
    pub api_key_value: Option<String>,
    pub api_key_secret: Option<String>,
}

#[derive(Fields, Deserialize, Default)]
pub struct ApiKeyForUpdate {
    pub title: Option<String>,
    pub api_key_value: Option<String>,
    pub api_key_secret: Option<String>,
}

#[derive(FilterNodes, Deserialize, Default, Debug)]
pub struct ApiKeyFilter {
    pub id: Option<OpValsInt64>,

    pub user_id: Option<OpValsInt64>,
    pub exchange_id: Option<OpValsInt64>,

    pub title: Option<OpValsString>,
    pub api_key_value: Option<OpValsString>,
    pub api_key_secret: Option<OpValsString>,

    pub cid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub ctime: Option<OpValsValue>,
    pub mid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub mtime: Option<OpValsValue>,
}

// endregion: --- ApiKey Types

// region:    --- ApiKeyBmc

pub struct ApiKeyBmc;

impl DbBmc for ApiKeyBmc {
    const TABLE: &'static str = "api_key";
}

// This will generate the `impl ApiKeyBmc {...}` with the default CRUD functions.
generate_common_bmc_fns!(
	Bmc: ApiKeyBmc,
	Entity: ApiKey,
	ForCreate: ApiKeyForCreate,
	ForUpdate: ApiKeyForUpdate,
	Filter: ApiKeyFilter
);

// TODO hash the secret
// TODO check if its a referral api key
// Additional ApiKeyBmc methods to manage the `ApiKeyMsg` constructs.
// impl ApiKeyBmc {
/// Add a `Trade` to a `ApiKey`
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

// endregion: --- ApiKeyBmc

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
        let fx_title = "test_create_ok apikey title";
        let fx_api_key_value = "test_create_ok api key value";
        let fx_api_key_secret = "test_create_ok api key secret";

        // -- Exec
        let apikey_id = ApiKeyBmc::create(
            &ctx,
            &mm,
            ApiKeyForCreate {
                user_id: ctx.user_id(),
                exchange_id: 0,
                title: Some(fx_title.to_string()),
                api_key_value: Some(fx_api_key_value.to_string()),
                api_key_secret: Some(fx_api_key_secret.to_string()),
            },
        )
            .await?;

        // -- Check
        let apikey: ApiKey = ApiKeyBmc::get(&ctx, &mm, apikey_id).await?;
        assert_eq!(apikey.title.ok_or("apikey should have title")?, fx_title);
        assert_eq!(apikey.api_key_value.ok_or("apikey should have value")?, fx_api_key_value);
        assert_eq!(apikey.api_key_secret.ok_or("apikey should have secret")?, fx_api_key_secret);

        // -- Clean
        ApiKeyBmc::delete(&ctx, &mm, apikey_id).await?;

        Ok(())
    }

    #[serial]
    #[tokio::test]
    async fn test_list_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_title_prefix = "test_create_ok apikey title - ";
        let fx_api_key_value_prefix = "test_create_ok apikey value - ";
        let fx_api_key_secret_prefix = "test_create_ok apikey secret - ";

        for i in 1..=6 {
            let _apikey_id = ApiKeyBmc::create(
                &ctx,
                &mm,
                ApiKeyForCreate {
                    user_id: ctx.user_id(),
                    exchange_id: 0,
                    title: Some(format!("{fx_title_prefix}{:<02}", i)),
                    api_key_value: Some(format!("{fx_api_key_value_prefix}{:<02}", i)),
                    api_key_secret: Some(format!("{fx_api_key_secret_prefix}{:<02}", i)),
                },
            )
                .await?;
        }

        // -- Exec
        let apikeys = ApiKeyBmc::list(
            &ctx,
            &mm,
            Some(vec![ApiKeyFilter {
                ..Default::default()
            }]),
            None,
        )
            .await?;

        // -- Check
        // extract the 04, 05, 06 parts of the tiles
        let num_parts = apikeys
            .iter()
            .filter_map(|j| j.title.as_ref().and_then(|s| s.split("- ").nth(1)))
            .collect::<Vec<&str>>();
        assert_eq!(num_parts, &["01", "02", "03", "04", "05", "06"]);

        // -- Clean
        // This should delete cascade
        // TODO delete all apikeys
        // ApiKeyBmc::delete(&ctx, &mm, agent_id).await?;

        Ok(())
    }
}

// endregion: --- Tests

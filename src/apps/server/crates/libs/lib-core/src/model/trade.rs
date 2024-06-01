use crate::ctx::Ctx;
use crate::generate_common_bmc_fns;
use crate::model::base::{self, DbBmc};
use crate::model::modql_utils::time_to_sea_value;
use crate::model::ModelManager;
use crate::model::Result;
use lib_utils::time::Rfc3339;
use modql::field::Fields;
use modql::filter::{
    FilterNodes, ListOptions, OpValsInt64, OpValsString, OpValsValue, OpValsBool
};
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use sea_query::Nullable;
use sqlx::types::time::OffsetDateTime;
use sqlx::FromRow;

// region:    --- Journal Types

/// Trait to implement on entities that have a trade_id
/// This will allow Ctx to be upgraded with the corresponding trade_id for
/// future access control.
pub trait TradeScoped {
    fn trade_id(&self) -> i64;
}

#[derive(Debug, Clone, sqlx::Type, derive_more::Display, Deserialize, Serialize)]
#[sqlx(type_name = "trade_type")]
#[derive(PartialEq)]
pub enum TradeType {
    Spot,
    Option,
    Future,
}

impl From<TradeType> for sea_query::Value {
    fn from(val: TradeType) -> Self {
        val.to_string().into()
    }
}

/// Note: This is required for sea::query in case of None.
///       However, in this codebase, we utilize the modql not_none_field,
///       so this will be disregarded anyway.
///       Nonetheless, it's still necessary for compilation.
impl Nullable for TradeType {
    fn null() -> sea_query::Value {
        TradeType::Spot.into()
    }
}

#[derive(Debug, Clone, sqlx::Type, derive_more::Display, Deserialize, Serialize)]
#[sqlx(type_name = "direction_type")]
#[derive(PartialEq)]
pub enum DirectionType {
    Buy,
    Sell,
}

impl From<DirectionType> for sea_query::Value {
    fn from(val: DirectionType) -> Self {
        val.to_string().into()
    }
}

/// Note: This is required for sea::query in case of None.
///       However, in this codebase, we utilize the modql not_none_field,
///       so this will be disregarded anyway.
///       Nonetheless, it's still necessary for compilation.
impl Nullable for DirectionType {
    fn null() -> sea_query::Value {
        DirectionType::Buy.into()
    }
}
#[derive(Debug, Clone, sqlx::Type, derive_more::Display, Deserialize, Serialize)]
#[sqlx(type_name = "option_type")]
#[derive(PartialEq)]
pub enum OptionType {
    Call,
    Put,
}

impl From<OptionType> for sea_query::Value {
    fn from(val: OptionType) -> Self {
        val.to_string().into()
    }
}

/// Note: This is required for sea::query in case of None.
///       However, in this codebase, we utilize the modql not_none_field,
///       so this will be disregarded anyway.
///       Nonetheless, it's still necessary for compilation.
impl Nullable for OptionType {
    fn null() -> sea_query::Value {
        OptionType::Call.into()
    }
}

#[serde_as]
#[derive(Debug, Clone, Fields, FromRow, Serialize)]
pub struct Trade {
    pub id: i64,

    // -- Relations
    pub user_id: i64,
    pub journal_id: i64,

    // -- Properties
    pub trade_type: TradeType,
    pub instrument: Option<String>,
    #[serde_as(as = "Rfc3339")]
    pub entry_time: OffsetDateTime,
    #[serde_as(as = "Option<Rfc3339>")]
    pub exit_time: Option<OffsetDateTime>,
    pub direction: DirectionType,
    pub option_type: Option<OptionType>,
    pub multiplier: Option<i32>,
    pub entry_price: Option<f32>,
    pub quantity: Option<f32>,
    pub target_stop_loss: Option<f32>,
    pub target_take_profit: Option<f32>,
    pub exit_price: Option<f32>,
    pub fees: Option<f32>,
    pub notes: Option<String>,
    pub highest_price: Option<f32>,
    pub lowest_price: Option<f32>,
    pub origin_take_profit_hit: Option<bool>,

    pub confidence: Option<i32>,
    pub entry_rating: Option<i32>,
    pub exit_rating: Option<i32>,
    pub execution_rating: Option<i32>,
    pub management_rating: Option<i32>,
    pub net_profit_loss: Option<f32>,
    pub gross_profit_loss: Option<f32>,
    pub pnl_percentage: Option<f32>,
    #[serde_as(as = "Option<Rfc3339>")]
    pub time_in_trade: Option<OffsetDateTime>,

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
pub struct TradeForCreate {
    pub user_id: i64,
    pub journal_id: i64,

    #[field(cast_as = "trade_type")]
    pub trade_type: Option<TradeType>,
    pub instrument: Option<String>,
    pub entry_time: Option<OffsetDateTime>,
    pub exit_time: Option<OffsetDateTime>,
    #[field(cast_as = "direction_type")]
    pub direction: Option<DirectionType>,
    #[field(cast_as = "option_type")]
    pub option_type: Option<OptionType>,
    pub multiplier: Option<i32>,
    pub entry_price: Option<f32>,
    pub quantity: Option<f32>,
    pub target_stop_loss: Option<f32>,
    pub target_take_profit: Option<f32>,
    pub exit_price: Option<f32>,
    pub fees: Option<f32>,
    pub notes: Option<String>,
    pub highest_price: Option<f32>,
    pub lowest_price: Option<f32>,
    pub origin_take_profit_hit: Option<bool>,

    pub confidence: Option<i32>,
    pub entry_rating: Option<i32>,
    pub exit_rating: Option<i32>,
    pub execution_rating: Option<i32>,
    pub management_rating: Option<i32>,
    pub net_profit_loss: Option<f32>,
    pub gross_profit_loss: Option<f32>,
    pub pnl_percentage: Option<f32>,
    pub time_in_trade: Option<OffsetDateTime>,
}

#[derive(Fields, Deserialize, Default)]
pub struct TradeForUpdate {
    #[field(cast_as = "trade_type")]
    pub trade_type: Option<TradeType>,
    pub instrument: Option<String>,
    pub entry_time: Option<OffsetDateTime>,
    pub exit_time: Option<OffsetDateTime>,
    #[field(cast_as = "direction_type")]
    pub direction: Option<DirectionType>,
    #[field(cast_as = "option_type")]
    pub option_type: Option<OptionType>,
    pub multiplier: Option<i32>,
    pub entry_price: Option<f32>,
    pub quantity: Option<f32>,
    pub target_stop_loss: Option<f32>,
    pub target_take_profit: Option<f32>,
    pub exit_price: Option<f32>,
    pub fees: Option<f32>,
    pub notes: Option<String>,
    pub highest_price: Option<f32>,
    pub lowest_price: Option<f32>,
    pub origin_take_profit_hit: Option<bool>,

    pub confidence: Option<i32>,
    pub entry_rating: Option<i32>,
    pub exit_rating: Option<i32>,
    pub execution_rating: Option<i32>,
    pub management_rating: Option<i32>,
    pub net_profit_loss: Option<f32>,
    pub gross_profit_loss: Option<f32>,
    pub pnl_percentage: Option<f32>,
    pub time_in_trade: Option<OffsetDateTime>,
}

#[derive(FilterNodes, Deserialize, Default, Debug)]
pub struct TradeFilter {
    pub id: Option<OpValsInt64>,

    pub user_id: Option<OpValsInt64>,
    pub journal_id: Option<OpValsInt64>,

    #[modql(cast_as = "trade_type")]
    pub trade_type: Option<OpValsString>,
    pub instrument: Option<OpValsString>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub entry_time: Option<OpValsValue>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub exit_time: Option<OpValsValue>,
    #[modql(cast_as = "direction_type")]
    pub direction: Option<OpValsString>,
    #[modql(cast_as = "option_type")]
    pub option_type: Option<OpValsString>,
    pub multiplier: Option<OpValsValue>,
    pub entry_price: Option<OpValsValue>,
    pub quantity: Option<OpValsValue>,
    pub target_stop_loss: Option<OpValsValue>,
    pub target_take_profit: Option<OpValsValue>,
    pub exit_price: Option<OpValsValue>,
    pub fees: Option<OpValsValue>,
    pub notes: Option<OpValsString>,
    pub highest_price: Option<OpValsValue>,
    pub lowest_price: Option<OpValsValue>,
    pub origin_take_profit_hit: Option<OpValsBool>,

    pub confidence: Option<OpValsValue>,
    pub entry_rating: Option<OpValsValue>,
    pub exit_rating: Option<OpValsValue>,
    pub execution_rating: Option<OpValsValue>,
    pub management_rating: Option<OpValsValue>,
    pub net_profit_loss: Option<OpValsValue>,
    pub gross_profit_loss: Option<OpValsValue>,
    pub pnl_percentage: Option<OpValsValue>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub time_in_trade: Option<OpValsValue>,

    pub cid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub ctime: Option<OpValsValue>,
    pub mid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub mtime: Option<OpValsValue>,
}

// endregion: --- Journal Types

// region:    --- JournalBmc

pub struct TradeBmc;

impl DbBmc for TradeBmc {
    const TABLE: &'static str = "trade";

    fn requires_user_specific_access() -> bool { true }
}

// This will generate the `impl TradeBmc {...}` with the default CRUD functions.
generate_common_bmc_fns!(
	Bmc: TradeBmc,
	Entity: Trade,
	ForCreate: TradeForCreate,
	ForUpdate: TradeForUpdate,
	Filter: TradeFilter
);

// Add the function to get trades with tags
pub async fn get_trades_with_tags(pool: &PgPool) -> Result<Vec<Trade>, sqlx::Error> {
    let query: SelectStatement = Query::select()
        .columns(vec![
            (trade::Table, trade::Id),
            (trade::Table, trade::UserId),
            (trade::Table, trade::JournalId),
            // ... other trade columns ...
            (tag::Table, tag::Id),
            (tag::Table, tag::UserId),
            (tag::Table, tag::TagName),
            (tag::Table, tag::TagType),
            (tag::Table, tag::Description),
            (tag::Table, tag::Cid),
            (tag::Table, tag::Ctime),
            (tag::Table, tag::Mid),
            (tag::Table, tag::Mtime),
        ])
        .from(trade::Table)
        .left_join(trade_tag::Table, Expr::col((trade::Table, trade::Id)).equals((trade_tag::Table, trade_tag::TradeId)))
        .left_join(tag::Table, Expr::col((trade_tag::Table, trade_tag::TagId)).equals((tag::Table, tag::Id)))
        .to_owned();

    let (sql, values) = query.build_sqlx(PostgresQueryBuilder);
    let rows = sqlx::query_as::<_, (Trade, Option<Tag>)>(&sql)
        .fetch_all(pool)
        .await?;

    // Aggregate tags for each trade
    let mut trades_map = std::collections::HashMap::new();
    for (mut trade, tag) in rows {
        if let Some(tag) = tag {
            trades_map.entry(trade.id).or_insert_with(|| {
                trade.tags = vec![tag];
                trade
            }).tags.push(tag);
        } else {
            trades_map.entry(trade.id).or_insert(trade);
        }
    }

    Ok(trades_map.into_values().collect())
}

pub async fn list_trades_with_tags(ctx: &Ctx, mm: &ModelManager) -> Result<Vec<Trade>> {
    let pool = mm.dbx().clone();
    get_trades_with_tags(&pool).await.map_err(|e| Error::DbxError { source: e })
}

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
    // type Error = Box<dyn std::error::Error>;
    // type Result<T> = core::result::Result<T, Error>; // For tests.

    // use super::*;
    // use crate::_dev_utils::{self};
    // use crate::ctx::Ctx;
    // use serial_test::serial;

    // #[serial]
    // #[tokio::test]
    // async fn test_create_ok() -> Result<()> {
    //     // -- Setup & Fixtures
    //     let mm = _dev_utils::init_test().await;
    //     let ctx = Ctx::root_ctx();
    //     let fx_trade_name = "test_create_ok trade name 01";
    //     let fx_trade_type = TradeType::Future;
    //     let fx_description = "test_create_ok description 01";
    //
    //     // -- Exec
    //     let trade_id = TradeBmc::create(
    //         &ctx,
    //         &mm,
    //         TradeForCreate {
    //             user_id: ctx.user_id(),
    //             trade_name: Some(fx_trade_name.to_string()),
    //             trade_type: Some(fx_trade_type.clone()),
    //             description: Some(fx_description.to_string()),
    //         },
    //     )
    //         .await?;
    //
    //     // -- Check
    //     let trade: Trade = TradeBmc::get(&ctx, &mm, trade_id).await?;
    //     assert_eq!(&trade.trade_type, &fx_trade_type);
    //     assert_eq!(trade.trade_name.ok_or("trade should have name")?, fx_trade_name);
    //
    //     // -- Clean
    //     TradeBmc::delete(&ctx, &mm, trade_id).await?;
    //
    //     Ok(())
    // }

    // #[serial]
    // #[tokio::test]
    // async fn test_list_ok() -> Result<()> {
    //     // -- Setup & Fixtures
    //     let mm = _dev_utils::init_test().await;
    //     let ctx = Ctx::root_ctx();
    //     let fx_trade_name_prefix = "test_list_ok trade - ";
    //     let fx_description_prefix = "test_list_ok trade - ";
    //
    //     for i in 1..=6 {
    //         let trade_type = if i <= 3 {
    //             TradeType::Entry
    //         } else {
    //             TradeType::Exit
    //         };
    //
    //         let _trade_id = TradeBmc::create(
    //             &ctx,
    //             &mm,
    //             TradeForCreate {
    //                 user_id: ctx.user_id(),
    //                 trade_name: Some(format!("{fx_trade_name_prefix}{:<02}", i)),
    //                 trade_type: Some(trade_type),
    //                 description: Some(format!("{fx_description_prefix}{:<02}", i)),
    //             },
    //         )
    //             .await?;
    //     }
    //
    //     // -- Exec
    //     let trades = TradeBmc::list(
    //         &ctx,
    //         &mm,
    //         Some(vec![TradeFilter {
    //             trade_type: Some(OpValString::In(vec!["Entry".to_string()]).into()),
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
    //     let num_parts = trades
    //         .iter()
    //         .filter_map(|c| c.trade_name.as_ref().and_then(|s| s.split("- ").nth(1)))
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
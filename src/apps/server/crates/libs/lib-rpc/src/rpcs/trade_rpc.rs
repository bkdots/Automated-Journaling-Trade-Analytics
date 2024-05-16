use crate::rpcs::prelude::*;
use lib_core::model::trade::{
    Trade, TradeBmc, TradeFilter, TradeForCreate, TradeForUpdate,
};

pub fn rpc_router() -> RpcRouter {
    rpc_router!(
		// Same as RpcRouter::new().add...
		create_trade,
		get_trade,
		list_trades,
		update_trade,
		delete_trade,
	)
}

generate_common_rpc_fns!(
	Bmc: TradeBmc,
	Entity: Trade,
	ForCreate: TradeForCreate,
	ForUpdate: TradeForUpdate,
	Filter: TradeFilter,
	Suffix: trade
);

// /// Returns conv_msg
// pub async fn add_conv_msg(
//     ctx: Ctx,
//     mm: ModelManager,
//     params: ParamsForCreate<ConvMsgForCreate>,
// ) -> Result<DataRpcResult<ConvMsg>> {
//     let ParamsForCreate { data: msg_c } = params;
//
//     let msg_id = ConvBmc::add_msg(&ctx, &mm, msg_c).await?;
//     let msg = ConvBmc::get_msg(&ctx, &mm, msg_id).await?;
//
//     Ok(msg.into())
// }
//
// /// Returns conv_msg
// pub async fn get_conv_msg(
//     ctx: Ctx,
//     mm: ModelManager,
//     params: ParamsIded,
// ) -> Result<DataRpcResult<ConvMsg>> {
//     let ParamsIded { id: msg_id } = params;
//
//     let msg = ConvBmc::get_msg(&ctx, &mm, msg_id).await?;
//
//     Ok(msg.into())
// }

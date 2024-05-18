use crate::rpcs::prelude::*;
use lib_core::model::exchange::{
    Exchange, ExchangeBmc, ExchangeFilter, ExchangeForCreate, ExchangeForUpdate,
};

pub fn rpc_router() -> RpcRouter {
    rpc_router!(
		// Same as RpcRouter::new().add...
		create_exchange,
		get_exchange,
		list_exchanges,
		update_exchange,
		delete_exchange,
	)
}

generate_common_rpc_fns!(
	Bmc: ExchangeBmc,
	Entity: Exchange,
	ForCreate: ExchangeForCreate,
	ForUpdate: ExchangeForUpdate,
	Filter: ExchangeFilter,
	Suffix: exchange
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

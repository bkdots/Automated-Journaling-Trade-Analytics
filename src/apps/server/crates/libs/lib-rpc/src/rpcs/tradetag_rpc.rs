use crate::rpcs::prelude::*;
use lib_core::model::tradetag::{
    TradeTag, TradeTagBmc, TradeTagFilter, TradeTagForCreate, TradeTagForUpdate,
};

pub fn rpc_router() -> RpcRouter {
    rpc_router!(
		// Same as RpcRouter::new().add...
		create_tradetag,
		get_tradetag,
		list_tradetags,
		update_tradetag,
		delete_tradetag,
	)
}

generate_common_rpc_fns!(
	Bmc: TradeTagBmc,
	Entity: TradeTag,
	ForCreate: TradeTagForCreate,
	ForUpdate: TradeTagForUpdate,
	Filter: TradeTagFilter,
	Suffix: tradetag
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

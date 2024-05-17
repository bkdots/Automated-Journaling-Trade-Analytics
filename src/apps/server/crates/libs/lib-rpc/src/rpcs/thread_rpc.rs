use crate::rpcs::prelude::*;
use lib_core::model::thread::{
    Thread, ThreadBmc, ThreadFilter, ThreadForCreate, ThreadForUpdate,
};

pub fn rpc_router() -> RpcRouter {
    rpc_router!(
		// Same as RpcRouter::new().add...
		create_thread,
		get_thread,
		list_threads,
		update_thread,
		delete_thread
	)
}

generate_common_rpc_fns!(
	Bmc: ThreadBmc,
	Entity: Thread,
	ForCreate: ThreadForCreate,
	ForUpdate: ThreadForUpdate,
	Filter: ThreadFilter,
	Suffix: thread
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

use crate::rpcs::prelude::*;
use lib_core::model::journal::{
    Journal, JournalBmc, JournalFilter, JournalForCreate, JournalForUpdate,
};
// use lib_core::model::conv_msg::{ConvMsg, ConvMsgForCreate};

pub fn rpc_router() -> RpcRouter {
    rpc_router!(
		// Same as RpcRouter::new().add...
		create_journal,
		get_journal,
		list_journals,
		update_journal,
		delete_journal,
	)
}

generate_common_rpc_fns!(
	Bmc: JournalBmc,
	Entity: Journal,
	ForCreate: JournalForCreate,
	ForUpdate: JournalForUpdate,
	Filter: JournalFilter,
	Suffix: journal
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

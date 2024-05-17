use crate::rpcs::prelude::*;
use lib_core::model::tag::{
    Tag, TagBmc, TagFilter, TagForCreate, TagForUpdate,
};

pub fn rpc_router() -> RpcRouter {
    rpc_router!(
		// Same as RpcRouter::new().add...
		create_tag,
		get_tag,
		list_tags,
		update_tag,
		delete_tag,
	)
}

generate_common_rpc_fns!(
	Bmc: TagBmc,
	Entity: Tag,
	ForCreate: TagForCreate,
	ForUpdate: TagForUpdate,
	Filter: TagFilter,
	Suffix:tag
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

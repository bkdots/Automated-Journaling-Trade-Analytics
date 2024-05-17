use crate::rpcs::prelude::*;
use lib_core::model::apikey::{
	ApiKey, ApiKeyBmc, ApiKeyFilter, ApiKeyForCreate, ApiKeyForUpdate,
};

pub fn rpc_router() -> RpcRouter {
    rpc_router!(
		// Same as RpcRouter::new().add...
		create_apikey,
		get_apikey,
		list_apikeys,
		update_apikey,
		delete_apikey,
	)
}

generate_common_rpc_fns!(
	Bmc: ApiKeyBmc,
	Entity: ApiKey,
	ForCreate: ApiKeyForCreate,
	ForUpdate: ApiKeyForUpdate,
	Filter: ApiKeyFilter,
	Suffix: apikey
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

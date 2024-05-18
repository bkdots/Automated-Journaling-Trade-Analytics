use crate::router::RpcRouter;

pub mod agent_rpc;
pub mod conv_rpc;
pub mod journal_rpc;
pub mod apikey_rpc;
pub mod exchange_rpc;
pub mod tag_rpc;
pub mod trade_rpc;
pub mod tradetag_rpc;
pub mod thread_rpc;
mod macro_utils;
mod prelude;

pub fn all_rpc_router() -> RpcRouter {
	RpcRouter::new()
		.extend(agent_rpc::rpc_router())
		.extend(conv_rpc::rpc_router())
		.extend(journal_rpc::rpc_router())
		.extend(apikey_rpc::rpc_router())
		.extend(exchange_rpc::rpc_router())
		.extend(tag_rpc::rpc_router())
		.extend(trade_rpc::rpc_router())
		.extend(tradetag_rpc::rpc_router())
		.extend(thread_rpc::rpc_router())
}

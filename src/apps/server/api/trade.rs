use actix_web::{
    get,
    post,
    put,
    error::ResponseError,
    web::Path,
    web::Json,
    web::Data,
    HttpResponse,
    http::{header::ContentType, StatusCode}
};
use serde::{Serialize, Deserialize};
use derive_more::{Display};

#[derive(Deserialize, Serialize)]
pub struct TradeIdentifier {
    trade_global_id: String,
}

#[get("/trade/{trade_global_id}")]
pub async fn get_trade(trade_identifier: Path<TradeIdentifier>, body: Json<Struct>) -> Json<String> {
    return Json(trade_identifier.into_inner().trade_global_id);
}
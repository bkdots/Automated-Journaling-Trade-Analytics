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

#[derive(Serialize, Deserialize)]
struct Trade {
    id: i32,
    name: String,
    value: f64,
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/trades")
            .route("/", web::get().to(get_trades))
            .route("/{id}", web::get().to(get_trade_by_id))
    );
}

#[get("/")]
async fn get_trades() -> HttpResponse {
    let trades = vec![
        Trade { id: 1, name: "Trade 1".to_string(), value: 100.0 },
        Trade { id: 2, name: "Trade 2".to_string(), value: 200.0 },
    ];

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .json(trades)
}

#[get("/{id}")]
async fn get_trade_by_id(path: Path<i32>) -> HttpResponse {
    let trades = vec![
        Trade { id: 1, name: "Trade 1".to_string(), value: 100.0 },
        Trade { id: 2, name: "Trade 2".to_string(), value: 200.0 },
    ];

    let trade = trades.into_iter().find(|t| t.id == *path);
    match trade {
        Some(trade) => HttpResponse::Ok().json(trade),
        None => HttpResponse::NotFound().finish(),
    }
}

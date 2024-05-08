// region:    --- Modules

mod error;

pub use self::error::{Error, Result};

use crate::config;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use tokio::time::Duration;

// endregion: --- Modules

pub type Db = Pool<Postgres>;

pub async fn new_db_pool() -> Result<Db> {
	PgPoolOptions::new()
		// put max connections into a environment variable or config
		.max_connections(5)
		.acquire_timeout(Duration::from_millis(500))
		.connect(&config().DB_URL)
		.await
		.map_err(|ex| Error::FailToCreatePool(ex.to_string()))
}

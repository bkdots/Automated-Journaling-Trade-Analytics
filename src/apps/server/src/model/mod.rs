//! Model Layer
//!
//! Design:
//!
//! - The model layer normalized the application's data type
//! 	structures and access.
//! - All application code data access must go through the model layer.
//! - The ModelManager holds the internal states/resources
//! 	needed by ModelControllers to access data
//! 	(e.g., db_pool, s3 client, redis client).
//! - Model controllers (e.g., TaskBmc, ProjectBmc) implement
//! 	CRUD and other data access methods on a given "entity"
//! 	(e.g., Task, Project)
//! 	(Bmc is short for Backend Model Controller).
//! - In frameworks like Axum, Tauri, ModelManager are typically used as App state
//! - ModelManager are designed to be passed as an argument
//! 	to all Model Controllers functions


// region:    --- Modules

mod error;
mod store;
pub mod task;

pub use self::error::{Error, Result};

use crate::model::store::Db;
use crate::model::store::new_db_pool;

// endregion: --- Modules

#[derive(Clone)]
pub struct ModelManager {
	db: Db,
}

impl ModelManager {
	// Constructor
	pub async fn new() -> Result<Self> {
		let db = new_db_pool().await?;

		// FIXME - TBC
		Ok(ModelManager { db })
	}

	// Returns the sqlx db pool reference.
	// (only for the model layer)
	pub(in crate::model) fn db(&self) -> &Db {
		&self.db
	}
}

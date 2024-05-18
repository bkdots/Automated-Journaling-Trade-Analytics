use crate::ctx::Ctx;
use crate::generate_common_bmc_fns;
use crate::model::base::{self, DbBmc};
use crate::model::modql_utils::time_to_sea_value;
use crate::model::ModelManager;
use crate::model::Result;
use lib_utils::time::Rfc3339;
use modql::field::Fields;
use modql::filter::{
    FilterNodes, ListOptions, OpValsInt64, OpValsString, OpValsValue,
};
use serde::{Deserialize, Serialize};
use serde_with::serde_as;
use sea_query::Nullable;
use sqlx::types::time::OffsetDateTime;
use sqlx::FromRow;

// region:    --- Journal Types

/// Trait to implement on entities that have a tag_id
/// This will allow Ctx to be upgraded with the corresponding tag_id for
/// future access control.
pub trait TagScoped {
    fn tag_id(&self) -> i64;
}

#[derive(Debug, Clone, sqlx::Type, derive_more::Display, Deserialize, Serialize)]
#[sqlx(type_name = "tag_type")]
#[derive(PartialEq)]
pub enum TagType {
    Entry,
    Exit,
    Management,
    Mistake,
}

impl From<TagType> for sea_query::Value {
    fn from(val: TagType) -> Self {
        val.to_string().into()
    }
}

/// Note: This is required for sea::query in case of None.
///       However, in this codebase, we utilize the modql not_none_field,
///       so this will be disregarded anyway.
///       Nonetheless, it's still necessary for compilation.
impl Nullable for TagType {
    fn null() -> sea_query::Value {
        TagType::Entry.into()
    }
}

#[serde_as]
#[derive(Debug, Clone, Fields, FromRow, Serialize)]
pub struct Tag {
    pub id: i64,

    // -- Relations
    pub user_id: i64,

    // -- Properties
    pub tag_name: Option<String>,
    pub tag_type: TagType,
    pub description: Option<String>,

    // -- Timestamps
    // creator user_id and time
    pub cid: i64,
    #[serde_as(as = "Rfc3339")]
    pub ctime: OffsetDateTime,
    // last modifier user_id and time
    pub mid: i64,
    #[serde_as(as = "Rfc3339")]
    pub mtime: OffsetDateTime,
}

#[derive(Fields, Deserialize, Default)]
pub struct TagForCreate {
    pub user_id: i64,

    pub tag_name: Option<String>,
    #[field(cast_as = "tag_type")]
    pub tag_type: Option<TagType>,
    pub description: Option<String>,
}

#[derive(Fields, Deserialize, Default)]
pub struct TagForUpdate {
    pub tag_name: Option<String>,
    #[field(cast_as = "tag_type")]
    pub tag_type: Option<TagType>,
    pub description: Option<String>,
}

#[derive(FilterNodes, Deserialize, Default, Debug)]
pub struct TagFilter {
    pub id: Option<OpValsInt64>,

    pub user_id: Option<OpValsInt64>,

    pub tag_name: Option<OpValsString>,
    #[modql(cast_as = "tag_type")]
    pub tag_type: Option<OpValsString>,
    pub description: Option<OpValsString>,

    pub cid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub ctime: Option<OpValsValue>,
    pub mid: Option<OpValsInt64>,
    #[modql(to_sea_value_fn = "time_to_sea_value")]
    pub mtime: Option<OpValsValue>,
}

// endregion: --- Journal Types

// region:    --- JournalBmc

pub struct TagBmc;

impl DbBmc for TagBmc {
    const TABLE: &'static str = "tag";

    fn requires_user_specific_access() -> bool { true }
}

// This will generate the `impl TagBmc {...}` with the default CRUD functions.
generate_common_bmc_fns!(
	Bmc: TagBmc,
	Entity: Tag,
	ForCreate: TagForCreate,
	ForUpdate: TagForUpdate,
	Filter: TagFilter
);

// Additional JournalBmc methods to manage the `JournalMsg` constructs.
// impl JournalBmc {
/// Add a `Trade` to a `Journal`
///
// For access constrol, we will add:
// #[ctx_add(conv, space)]
// #[requires_privilege_any_of("og:FullAccess", "sp:FullAccess", "conv@owner_id" "conv:AddMsg")]
// pub async fn add_msg(
//     ctx: &Ctx,
//     mm: &ModelManager,
//     msg_c: ConvMsgForCreate,
// ) -> Result<i64> {
//     let msg_i = ConvMsgForInsert::from_msg_for_create(ctx.user_id(), msg_c);
//     let conv_msg_id = base::create::<ConvMsgBmc, _>(ctx, mm, msg_i).await?;
//
//     Ok(conv_msg_id)
// }

/// NOTE: The current strategy is to not require conv_id, but we will check
///       that user have `conv:ReadMsg` privilege on correponding conv (post base::get).
// pub async fn get_msg(
//     ctx: &Ctx,
//     mm: &ModelManager,
//     msg_id: i64,
// ) -> Result<ConvMsg> {
//     let conv_msg: ConvMsg = base::get::<ConvMsgBmc, _>(ctx, mm, msg_id).await?;
//
//     // TODO: Validate conv_msg is with ctx.conv_id
//     //       let _ctx = ctx.add_conv_id(conv_msg.conv_id());
//     //       assert_privileges(&ctx, &mm, &["conv@owner_id", "conv:ReadMsg"]);
//
//     Ok(conv_msg)
// }
// }

// endregion: --- JournalBmc

// region:    --- Tests

#[cfg(test)]
mod tests {
    type Error = Box<dyn std::error::Error>;
    type Result<T> = core::result::Result<T, Error>; // For tests.

    use super::*;
    use crate::_dev_utils::{self};
    use crate::ctx::Ctx;
    use modql::filter::OpValString;
    use serial_test::serial;

    #[serial]
    #[tokio::test]
    async fn test_create_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_tag_name = "test_create_ok tag name 01";
        let fx_tag_type = TagType::Entry;
        let fx_description = "test_create_ok description 01";

        // -- Exec
        let tag_id = TagBmc::create(
            &ctx,
            &mm,
            TagForCreate {
                user_id: ctx.user_id(),
                tag_name: Some(fx_tag_name.to_string()),
                tag_type: Some(fx_tag_type.clone()),
                description: Some(fx_description.to_string()),
            },
        )
            .await?;

        // -- Check
        let tag: Tag = TagBmc::get(&ctx, &mm, tag_id).await?;
        assert_eq!(&tag.tag_type, &fx_tag_type);
        assert_eq!(tag.tag_name.ok_or("tag should have name")?, fx_tag_name);

        // -- Clean
        TagBmc::delete(&ctx, &mm, tag_id).await?;

        Ok(())
    }

    #[serial]
    #[tokio::test]
    async fn test_list_ok() -> Result<()> {
        // -- Setup & Fixtures
        let mm = _dev_utils::init_test().await;
        let ctx = Ctx::root_ctx();
        let fx_tag_name_prefix = "test_list_ok tag - ";
        let fx_description_prefix = "test_list_ok tag - ";

        for i in 1..=6 {
            let tag_type = if i <= 3 {
                TagType::Entry
            } else {
                TagType::Exit
            };

            let _tag_id = TagBmc::create(
                &ctx,
                &mm,
                TagForCreate {
                    user_id: ctx.user_id(),
                    tag_name: Some(format!("{fx_tag_name_prefix}{:<02}", i)),
                    tag_type: Some(tag_type),
                    description: Some(format!("{fx_description_prefix}{:<02}", i)),
                },
            )
                .await?;
        }

        // -- Exec
        let tags = TagBmc::list(
            &ctx,
            &mm,
            Some(vec![TagFilter {
                tag_type: Some(OpValString::In(vec!["Entry".to_string()]).into()),
                // or
                // kind: Some(OpValString::Eq("MultiUsers".to_string()).into()),
                ..Default::default()
            }]),
            None,
        )
            .await?;

        // -- Check
        // extract the 04, 05, 06 parts of the tiles
        let num_parts = tags
            .iter()
            .filter_map(|c| c.tag_name.as_ref().and_then(|s| s.split("- ").nth(1)))
            .collect::<Vec<&str>>();
        assert_eq!(num_parts, &["01", "02", "03"]);

        // -- Clean
        // This should delete cascade
        // AgentBmc::delete(&ctx, &mm, agent_id).await?;

        Ok(())
    }
}

// endregion: --- Tests
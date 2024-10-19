import 'github-markdown-css/github-markdown.css';
import get from 'lodash/get';
import { addRequestTag, deleteRequestTag } from 'providers/ReduxStore/slices/collections';
import { useDispatch } from 'react-redux';
import TagList from './TagList/TagList';
import { getRequestsInfoInCollection } from 'utils/collections';


const Tags = ({ item, collection }) => {
  const tags = item.draft ? get(item, 'draft.request.tags') : get(item, 'request.tags');
  const [totalRequestsInCollection, tagListsCollection] = getRequestsInfoInCollection(collection);

  const dispatch = useDispatch();

  const handleAdd = (_tag) => {
    dispatch(
      addRequestTag({
        tag: _tag,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  const handleRemove = (_tag) => {
    dispatch(
      deleteRequestTag({
        tag: _tag,
        itemUid: item.uid,
        collectionUid: collection.uid
      })
    );
  };

  if (!item) {
    return null;
  }

  return (
    <div>
      <div className="mt-6">
        Tags in collection: <span className="font-medium">{tagListsCollection.join(',')}</span>
      </div>
      <div className="mt-6">
        <TagList tags={tags} onTagRemove={handleRemove} onTagAdd={handleAdd} suggestions={tagListsCollection} />
      </div>
    </div>
  );
};

export default Tags;

import { IconX } from '@tabler/icons';
import { useState } from 'react';
import toast from 'react-hot-toast';
import StyledWrapper from './StyledWrapper';

const TagList = ({ tags, onTagRemove, onTagAdd, suggestions }) => {
  const tagNameRegex = /^[\w-]+$/;
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleChange = (e) => {
	  const userInput = e.target.value;

    setText(userInput);
    const filtered = suggestions.filter(
      (suggestion) =>
        suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1
    );

    setFilteredSuggestions(filtered);
    setIsSuggestionVisible(true);
    setActiveIndex(0); 
  };

  const handleKeyDown = (e) => {
    if (e.code == 'Escape') {
      setText('');
      setIsEditing(false);
      setIsSuggestionVisible(false); 
      return;
    }
    if (e.code !== 'Enter' && e.code !== 'Space') {
      return;
    }
    if (!tagNameRegex.test(text)) {
      toast.error('Tags must only contain alpha-numeric characters, "-", "_"');
      return;
    }
    if (tags.includes(text)) {
      toast.error(`Tag "${text}" already exists`);
      return;
    }
    onTagAdd(text);
    setText('');
    setIsEditing(false);
  };

  const handleClick = (suggestion) => {
    console.log("suggestion:" + suggestion)
    onTagAdd(suggestion);
    setText('');
    setIsEditing(false);
    setFilteredSuggestions([]);
    setIsSuggestionVisible(false);
  };


  const renderSuggestions = () => {
    if (isSuggestionVisible && text) {
      if (filteredSuggestions.length) {
        return (
          <ul className="suggestions">
            {filteredSuggestions.map((suggestion, idx) => (
              <li
                key={suggestion}
                className={idx === activeIndex ? "active" : ""}
                onClick={() => handleClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <div className="no-suggestions">
            <em>No suggestions available</em>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <StyledWrapper className="flex flex-wrap gap-2 mt-1">
      <ul className="flex flex-wrap gap-1">
        {tags && tags.length
          ? tags.map((_tag) => (
              <li key={_tag}>
                <span>{_tag}</span>
                <button tabIndex={-1} onClick={() => onTagRemove(_tag)}>
                  <IconX strokeWidth={1.5} size={20} />
                </button>
              </li>
            ))
          : null}
      </ul>
      {isEditing ? (
        <div>
          <input
            type="text"
            placeholder="Space or Enter to add tag"
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          {renderSuggestions()}
        </div>
      ) : (
        <button className="text-link select-none" onClick={() => setIsEditing(true)}>
          + Add
        </button>
      )}
    </StyledWrapper>
  );
};

export default TagList;

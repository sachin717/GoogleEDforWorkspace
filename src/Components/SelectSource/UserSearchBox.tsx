import React, { useState } from 'react';
import { TextField, Persona, PersonaSize } from '@fluentui/react';

// Define TypeScript types if using TypeScript
type OptionItem = {
  id: string;
  image: string;
  initials: string;
  name: string;
  job: string;
  email: string;
};

interface UserSearchProps {
  options: OptionItem[];
  placeholder?: string;
  onSelect: (item: OptionItem) => void;
}

const UserSearchBox: React.FC<UserSearchProps> = ({ options, placeholder = 'Search...', onSelect }) => {
  const [userInput, setUserInput] = useState('');
  const [showList, setShowList] = useState(false);

  // Handle item click
  const handleSelect = (item: OptionItem) => {
    onSelect(item);
    setUserInput(item.name);
    setShowList(false);
  };

  // Handle input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
    setShowList(true);
  };

  // Filter options based on user input
  const filteredOptions = options.filter(item =>
    item.name.toLowerCase().includes(userInput.toLowerCase())
  );

  return (
    <div style={{ width: 450 }}>
      <TextField
        type="text"
        onChange={handleInputChange}
        value={userInput}
        placeholder={placeholder}
      />
      {showList && filteredOptions.length > 0 && (
        <div
          style={{
            backgroundColor: '#fff',
            borderRadius: '0px 0px 2px 2px',
            maxHeight: '196px',
            overflow: 'auto',
            boxShadow: '0px 0px 1px 0px',
          }}
        >
          {filteredOptions.map(item => (
            <ul key={item.id} className="DBPPStyleUL" style={{ listStyleType: 'none', padding: 0 }}>
              <li className="DBPPStyle" style={{ padding: '5px', cursor: 'pointer' }}>
                <div
                  onClick={() => handleSelect(item)}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundRepeat: 'no-repeat',
                      width: '32px',
                      height: '32px',
                      position: 'absolute',
                      borderRadius: '50%',
                      zIndex: 1,
                      backgroundPosition: 'center',
                      backgroundSize: 'cover',
                    }}
                  ></div>
                  <Persona
                    imageInitials={item.initials}
                    imageAlt={item.initials}
                    size={PersonaSize.size32}
                  />
                  <div >
                    <div style={{ color: '#333', fontSize: '13px' }}>
                      {item.name}
                    </div>
                    <div style={{ color: '#333', fontSize: '12px' }}>
                      {item.job}
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearchBox;

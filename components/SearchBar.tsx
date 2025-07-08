import React from 'react';
import { styled } from '@mui/material/styles';
import { InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1e293b',
  backgroundColor: 'rgba(235, 229, 229, 0.5)',
  borderRadius: '20px',
  transition: 'background-color 0.3s ease',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
    color: '#1e293b',
    fontSize: '16px',
  },
}));

// Modify the onChange type for a direct string value
const SearchBar = ({ value, onChange }: { value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
    <SearchIconWrapper>
      <SearchIcon style={{ color: '#1e293b' }} />
    </SearchIconWrapper>
    <StyledInputBase
      placeholder="Search…"
      value={value} 
      onChange={onChange} 
      inputProps={{ 'aria-label': 'search' }}
    />
  </div>
);

export default SearchBar;


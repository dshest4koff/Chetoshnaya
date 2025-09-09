import React from 'react';
import Papa from 'papaparse';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { DataPage } from './DataPage';
import Link from '@mui/material/Link';

const StyledBackground = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
    linear-gradient(
      135deg,
      ${theme.palette.primary.main}22,
      ${theme.palette.secondary.main}22
    )
  `,
  backdropFilter: 'blur(8px)',
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: { xs: '1rem', md: '2rem' },
  minWidth: "75%",
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
  borderRadius: '16px',
  backgroundColor: '#ffffffee',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
  },
  '& > *:not(:last-child)': {
    marginBottom: '2rem'
  }
}));

const Title = styled('h1')(({ theme }) => ({
  fontFamily: "'Inter', sans-serif",
  fontWeight: 700,
  fontSize: { xs: '2.5rem', md: '3.5rem' },
  color: theme.palette.primary.main,
  marginBottom: '2rem',
  textAlign: 'center',
  letterSpacing: '-0.02em',
}));

const DropZone = styled(Box)(({ theme, isDragging }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '200px',
  maxWidth: '500px',
  borderRadius: '12px',
  border: `2px dashed ${theme.palette.divider}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease-in-out',
  backgroundColor: isDragging
    ? `${theme.palette.primary.light}11`
    : 'transparent',
  margin: '0 2rem 2rem',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: `${theme.palette.primary.light}08`,
  },
}));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isDragging: false,
      isLoading: false,
      error: null
    };
    this.dropRef = React.createRef();
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.onDragOver = this.onDragOver.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this.onDragLeave = this.onDragLeave.bind(this);
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    this.processFile(file);
  }

  processFile(file) {
    this.setState({ isLoading: true, error: null });
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        this.setState({
          data: results.data,
          isLoading: false
        });
      },
      error: (error) => {
        this.setState({
          error: error.message,
          isLoading: false
        });
      }
    });
  }

  onDragOver(e) {
    e.preventDefault();
    this.setState({ isDragging: true });
  }

  onDrop(e) {
    e.preventDefault();
    this.setState({ isDragging: false });
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onDragLeave(e) {
    e.preventDefault();
    this.setState({ isDragging: false });
  }

  render() {
    const { data, isDragging, isLoading, error } = this.state;
    
    return (
      <StyledBackground>
        <ContentWrapper>
          <Title>ПОДСЧЕТОЧНАЯ</Title>
          <Box sx={{ color: 'text.secondary' }}>
            Примеры файлов для загрузки 
            <Link
              href={`https://helpdesk.mkod.ru/front/ticket.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=old&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=17&criteria%5B1%5D%5Bsearchtype%5D=morethan&_select_criteria%5B1%5D%5Bvalue%5D=0&criteria%5B1%5D%5Bvalue%5D=2025-06-01+16%3A40%3A05&criteria%5B2%5D%5Blink%5D=AND&criteria%5B2%5D%5Bfield%5D=5&criteria%5B2%5D%5Bsearchtype%5D=equals&criteria%5B2%5D%5Bvalue%5D=3064&criteria%5B3%5D%5Blink%5D=AND&criteria%5B3%5D%5Bfield%5D=1&criteria%5B3%5D%5Bsearchtype%5D=contains&criteria%5B3%5D%5Bvalue%5D=%281&search=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA&itemtype=Ticket&start=0&_glpi_csrf_token=7ea8f9d0885eaf66dcd04700fc57589dd7ef3be086c28f310d701bd04b3bc165`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
            {" пример 1"}
            </Link>
            <Link
              href={`https://helpdesk.mkod.ru/front/ticket.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=old&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=7&criteria%5B1%5D%5Bsearchtype%5D=contains&criteria%5B1%5D%5Bvalue%5D=%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87&criteria%5B2%5D%5Blink%5D=AND&criteria%5B2%5D%5Bfield%5D=1&criteria%5B2%5D%5Bsearchtype%5D=contains&criteria%5B2%5D%5Bvalue%5D=%28&criteria%5B3%5D%5Blink%5D=AND&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Blink%5D=AND&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bfield%5D=17&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bsearchtype%5D=morethan&_select_criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=0&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=2025-08-01+00%3A00%3A00&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Blink%5D=OR&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bfield%5D=16&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bsearchtype%5D=morethan&_select_criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=0&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=2025-08-01+00%3A00%3A00&criteria%5B4%5D%5Blink%5D=AND&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Blink%5D=AND&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bfield%5D=16&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bsearchtype%5D=lessthan&_select_criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=0&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=2025-08-31+23%3A59%3A59&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Blink%5D=OR&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bfield%5D=17&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bsearchtype%5D=lessthan&_select_criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=0&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=2025-08-31+23%3A59%3A59&search=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA&itemtype=Ticket&start=0&_glpi_csrf_token=da7ddd60ccb92f235a76cb000485b7bb961799408325f8f4322da28d065e0c4f`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
            {"/пример 2"}
            </Link>
          </Box>
          <DropZone 
            ref={this.dropRef}
            isDragging={isDragging}
            onDragOver={this.onDragOver}
            onDrop={this.onDrop}
            onDragLeave={this.onDragLeave}
          >
            <Box sx={{ textAlign: 'center' }} padding='0 2rem'>
              <IconButton 
                color="primary"
                sx={{
                  mb: 2,
                  fontSize: '2.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <FileCopyOutlinedIcon />
              </IconButton>
              <input id="upload-input" type="file" accept=".csv" onChange={this.handleFileUpload} />
              <Box sx={{ color: 'text.secondary' }}>
                Перетащите сюда файл или выберите вручную...
              </Box>
            </Box>
          </DropZone>

          {isLoading && (
            <Box sx={{ mt: 2, textAlign: 'center', marginBottom: "2rem" }}>
              Идёт обработка файла...
            </Box>
          )}

          {error && (
            <Box sx={{ mt: 2, color: 'error.main', textAlign: 'center' }}>
              Ошибка при обработке файла: {error}
            </Box>
          )}

          {data.length > 0 && (
            <DataPage data={data} />
          )}
        </ContentWrapper>
      </StyledBackground>
    );
  }
}

export default App;
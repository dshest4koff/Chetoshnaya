import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography, CircularProgress, IconButton, Button, Link, Switch } from '@mui/material';
import { DataPage } from './DataPage';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import CloseIcon from '@mui/icons-material/Close';

const Container = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: `
    linear-gradient(
      135deg,
      #1976d2 22%,
      #dc004e 78%
    )
  `,
  padding: '2rem',
}));

const MainBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  padding: '2rem',
  borderRadius: '16px',
  maxWidth: '950px',
  boxShadow: '0 12px 48px rgba(0, 0, 0, 0.12)',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const Title = styled(Typography)({
  fontSize: '1.8rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
});

const ModeSwitchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1.5rem',
}));

const ExampleLinks = styled(Box)(({ theme }) => ({
  marginBottom: '2rem',
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.9rem',
}));

// Анимация появления
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FileDropZone = styled(Box)(({ theme, isDragging }) => ({
  width: '100%',
  maxWidth: '860px',
  minHeight: '150px',
  border: '2px dashed #ccc',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  backgroundColor: isDragging ? '#e0e0e0' : '#f0f0f0',
  cursor: 'pointer',
  padding: '1rem',
  margin: '1rem 0',
  transition: 'background-color 0.3s, border-color 0.3s',
  animation: `${fadeIn} 0.3s ease`,
  '&:hover': {
    backgroundColor: '#e0e0e0',
    borderColor: '#999',
  },
}));

const FileInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '8px 12px',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  width: 'auto',
  maxWidth: '700px',
  marginTop: '10px',
  justifyContent: 'space-between',
  minWidth: '50%',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
}));

const FileNameText = styled(Typography)({
  wordBreak: 'break-word',
  fontSize: '0.9rem',
  maxWidth: '80%',
});

const UploadButton = styled(Button)({
  padding: '6px 12px',
  fontSize: '0.85rem',
  minWidth: '80px',
});

const DualFileContainer = styled(Box)({
  display: 'flex',
  gap: '4rem',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  marginBottom: '20px',
  flexWrap: 'wrap',
  
});

const FileColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '200px',
  animation: `${fadeIn} 0.5s ease`,
});

const FileLabel = styled(Typography)({
  marginBottom: '0.1rem',
  fontWeight: 600,
  fontSize: '1rem',
});

function App() {
  const [file, setFile] = useState(null);
  const [secondFile, setSecondFile] = useState(null);
  const [data, setData] = useState([]);
  const [secondData, setSecondData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isDualMode, setIsDualMode] = useState(false);
  const [filesLoaded, setFilesLoaded] = useState(false);
  const [loadingFile, setLoadingFile] = useState(null); // 'file' | 'second' | null
  const [fileName, setFileName] = useState('');
  const [secondFileName, setSecondFileName] = useState('');

  const handleDragEvents = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOver = useCallback((e) => {
    handleDragEvents(e);
    setIsDragging(true);
  }, [handleDragEvents]);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

const processFile = useCallback((fileToProcess, isSecondFile = false) => {
  if (!fileToProcess) return;
  setIsLoading(true);
  setError('');
  if (isSecondFile) {
    setLoadingFile('second');
  } else {
    setLoadingFile('file');
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    let text = e.target.result;

    // Убираем BOM, если есть
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }

    // Парсим содержимое
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (isSecondFile) {
          setSecondData(results.data);
        } else {
          setData(results.data);
        }
        setIsLoading(false);
        setLoadingFile(null);
      },
      error: (err) => {
        setError(`Ошибка обработки файла: ${err.message}`);
        setIsLoading(false);
        setLoadingFile(null);
      },
    });
  };

  reader.onerror = () => {
    setError('Ошибка чтения файла');
    setIsLoading(false);
    setLoadingFile(null);
  };

  // Читаем файл как текст с кодировкой UTF-8
  reader.readAsText(fileToProcess, 'UTF-8');
}, []);

  const handleDrop = useCallback((e, isSecondFile = false) => {
    handleDragEvents(e);
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        setError('Поддерживаются только CSV файлы');
        return;
      }
      if (isSecondFile) {
        setSecondFile(selectedFile);
        setSecondFileName(selectedFile.name);
        processFile(selectedFile, true);
        setFilesLoaded(true);
      } else {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        processFile(selectedFile, false);
      }
    }
  }, [handleDragEvents, processFile]);

  const handleFileUpload = useCallback((e, isSecondFile = false) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Поддерживаются только CSV файлы');
      return;
    }
    if (isSecondFile) {
      setSecondFile(selectedFile);
      setSecondFileName(selectedFile.name);
      setFilesLoaded(true);
      processFile(selectedFile, true);
    } else {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      processFile(selectedFile, false);
    }
  }, [processFile]);

  const handleRemoveFile = (isSecond) => {
    if (isSecond) {
      setSecondFile(null);
      setSecondData([]);
      setSecondFileName('');
    } else {
      setFile(null);
      setData([]);
      setFileName('');
    }
  };

  const uniqueData = () => {
    if (!isDualMode) return [];
    const secondIDs = secondData.map((item) => item['ID']);
    return data.filter((row) => !secondIDs.includes(row['ID']));
  };

  const renderFilePreview = (file) => {
    if (!file) return null;
    if (file.type && file.type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt="Preview"
          style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', transition: 'transform 0.3s' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
      );
    }
    return (
      <Box
        sx={{
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          transition: 'transform 0.3s',
        }}
      >
        📄
      </Box>
    );
  };

  return (
    <Container>
      <MainBox>
        <Title variant="h4" align="center">ПОДСЧЕТОЧНАЯ</Title>
        {/* Переключатель режима */}
        <ModeSwitchContainer>
          <Switch
            checked={isDualMode}
            onChange={(e) => {
              setIsDualMode(e.target.checked);
              setFile(null);
              setSecondFile(null);
              setData([]);
              setSecondData([]);
              setFileName('');
              setSecondFileName('');
              setFilesLoaded(false);
            }}
            color="primary"
          />
          <Typography variant="body1" ml={1}>
            {isDualMode ? 'Режим двух файлов' : 'Режим одного файла'}
          </Typography>
        </ModeSwitchContainer>

        {/* Примеры */}
        { !isDualMode && (
          <ExampleLinks>
          <Typography variant="body2">
            Примеры файлов для загрузки:&nbsp;
            <Link href="https://helpdesk.mkod.ru/front/ticket.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=old&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=17&criteria%5B1%5D%5Bsearchtype%5D=morethan&_select_criteria%5B1%5D%5Bvalue%5D=0&criteria%5B1%5D%5Bvalue%5D=2025-09-01+00%3A00%3A00&criteria%5B2%5D%5Blink%5D=AND&criteria%5B2%5D%5Bfield%5D=5&criteria%5B2%5D%5Bsearchtype%5D=equals&criteria%5B2%5D%5Bvalue%5D=3140&criteria%5B3%5D%5Blink%5D=AND&criteria%5B3%5D%5Bfield%5D=1&criteria%5B3%5D%5Bsearchtype%5D=contains&criteria%5B3%5D%5Bvalue%5D=%28&search=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA&itemtype=Ticket&start=0&_glpi_csrf_token=c6e6172127349f8263f9e4a690012f6b8644276aa7b613fd88b9ac402f003330" target="_blank" rel="noopener noreferrer" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' } }}>
              пример 1
            </Link> |
            <Link href="https://helpdesk.mkod.ru/front/ticket.php?is_deleted=0&as_map=0&criteria%5B0%5D%5Blink%5D=AND&criteria%5B0%5D%5Bfield%5D=12&criteria%5B0%5D%5Bsearchtype%5D=equals&criteria%5B0%5D%5Bvalue%5D=old&criteria%5B1%5D%5Blink%5D=AND&criteria%5B1%5D%5Bfield%5D=7&criteria%5B1%5D%5Bsearchtype%5D=contains&criteria%5B1%5D%5Bvalue%5D=%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87&criteria%5B2%5D%5Blink%5D=AND&criteria%5B2%5D%5Bfield%5D=1&criteria%5B2%5D%5Bsearchtype%5D=contains&criteria%5B2%5D%5Bvalue%5D=%28&criteria%5B3%5D%5Blink%5D=AND&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Blink%5D=AND&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bfield%5D=17&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bsearchtype%5D=morethan&_select_criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=0&criteria%5B3%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=2025-08-01+00%3A00%3A00&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Blink%5D=OR&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bfield%5D=16&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bsearchtype%5D=morethan&_select_criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=0&criteria%5B3%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=2025-08-01+00%3A00%3A00&criteria%5B4%5D%5Blink%5D=AND&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Blink%5D=AND&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bfield%5D=16&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bsearchtype%5D=lessthan&_select_criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=0&criteria%5B4%5D%5Bcriteria%5D%5B0%5D%5Bvalue%5D=2025-08-31+23%3A59%3A59&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Blink%5D=OR&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bfield%5D=17&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bsearchtype%5D=lessthan&_select_criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=0&criteria%5B4%5D%5Bcriteria%5D%5B1%5D%5Bvalue%5D=2025-08-31+23%3A59%3A59&search=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA&itemtype=Ticket&start=0&_glpi_csrf_token=da7ddd60ccb92f235a76cb000485b7bb961799408325f8f4322da28d065e0c4f" target="_blank" rel="noopener noreferrer" sx={{ mx: 1, '&:hover': { textDecoration: 'underline' } }}>
              пример 2
            </Link>
          </Typography>
        </ExampleLinks>
        )}

        {/* Для одного файла */}
        {!isDualMode ? (
          <FileDropZone
            isDragging={isDragging}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, false)}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept=".csv"
              style={{ display: 'none' }}
              id="single-file-input"
              onChange={(e) => handleFileUpload(e, false)}
            />
            {file ? (
              <FileInfoBox>
                {renderFilePreview(file)}
                <FileNameText>{fileName}</FileNameText>
                <IconButton size="small" onClick={() => handleRemoveFile(false)}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </FileInfoBox>
            ) : (
              <Box sx={{ textAlign: 'center', opacity: 0.8, transition: 'all 0.3s' }}>
                <Typography variant="body2" gutterBottom>
                  Перетащите или выберите файл с заявками
                </Typography>
                <UploadButton variant="contained" size="small" startIcon={<FileCopyOutlinedIcon />} onClick={() => document.getElementById('single-file-input').click()}>
                  Выбрать файл
                </UploadButton>
              </Box>
            )}
          </FileDropZone>
        ) : (
          // Для двух файлов — горизонтально
          <DualFileContainer>
            {/* Первый файл */}
            <FileColumn>
              <FileLabel>Новый файл</FileLabel>
              <FileDropZone
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, false)}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  id="file-input-1"
                  onChange={(e) => handleFileUpload(e, false)}
                />
                {file ? (
                  <FileInfoBox>
                    {renderFilePreview(file)}
                    <FileNameText>{fileName}</FileNameText>
                    <IconButton size="small" onClick={() => handleRemoveFile(false)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </FileInfoBox>
                ) : (
                  <Box sx={{ textAlign: 'center', opacity: 0.8, transition: 'all 0.3s' }}>
                    <Typography variant="body2" gutterBottom>
                      Перетащите или выберите файл с новыми заявками
                    </Typography>
                    <UploadButton variant="contained" size="small" startIcon={<FileCopyOutlinedIcon />} onClick={() => document.getElementById('file-input-1').click()}>
                      Выбрать файл
                    </UploadButton>
                  </Box>
                )}
              </FileDropZone>
            </FileColumn>
            {/* Второй файл */}
            <FileColumn>
              <FileLabel>Старый файл</FileLabel>
              <FileDropZone
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
                onDragLeave={handleDragLeave}
              >
                <input
                  type="file"
                  accept=".csv"
                  style={{ display: 'none' }}
                  id="file-input-2"
                  onChange={(e) => {
                    handleFileUpload(e, true);
                    setFilesLoaded(true);
                  }}
                />
                {secondFile ? (
                  <FileInfoBox>
                    {renderFilePreview(secondFile)}
                    <FileNameText>{secondFileName}</FileNameText>
                    <IconButton size="small" onClick={() => handleRemoveFile(true)}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </FileInfoBox>
                ) : (
                  <Box sx={{ textAlign: 'center', opacity: 0.8, transition: 'all 0.3s' }}>
                    <Typography variant="body2" gutterBottom>
                      Перетащите или выберите файл со старыми заявками
                    </Typography>
                    <UploadButton variant="contained" size="small" startIcon={<FileCopyOutlinedIcon />} onClick={() => document.getElementById('file-input-2').click()}>
                      Выбрать файл
                    </UploadButton>
                  </Box>
                )}
              </FileDropZone>
            </FileColumn>
          </DualFileContainer>
        )}

        {/* Индикатор загрузки */}
        {isLoading && (
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9, transition: 'opacity 0.3s' }}>
            <CircularProgress size={20} />
            <Typography variant="body2">Обработка файла...</Typography>
          </Box>
        )}

        {/* Ошибка */}
        {error && (
          <Box sx={{ mt: 2, color: 'error.main', textAlign: 'center' }}>
            {error}
          </Box>
        )}

        {/* Вывод данных */}
        {!isDualMode ? (
          <DataPage data={data} />
        ) : (
          filesLoaded && <DataPage data={uniqueData()} />
        )}
      </MainBox>
    </Container>
  );
}

export default App;
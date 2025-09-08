import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Link from '@mui/material/Link';

const Title = styled('h1')(({ theme }) => ({
  fontFamily: "'Inter', sans-serif",
  fontWeight: 700,
  fontSize: { xs: '2.5rem', md: '3.5rem' },
  color: theme.palette.primary.main,
  marginBottom: '2rem',
  textAlign: 'center',
  letterSpacing: '-0.02em',
  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
}));

const StatsBox = styled('div')(({ theme }) => ({
  width: 'fit-content',
  padding: '2rem',
  marginBottom: '1.5rem',
  borderRadius: '16px',
  boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
  backgroundColor: theme.palette.background.paper,
  borderLeft: `8px solid ${theme.palette.primary.main}`,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    backgroundColor: theme.palette.primary.main,
    transform: 'scaleY(1)',
    transition: 'transform 0.2s ease',
  },
  '&:hover::before': {
    transform: 'scaleY(2)',
  },
}));

const StatsHeader = styled('h3')(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  marginBottom: '0.5rem',
  marginTop: '-0.75rem',
}));

const StatsValue = styled('p')(({ theme }) => ({
  fontSize: '1.1rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  padding: '0 0',
  margin: '0 0'
}));

const StatsList = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: '0 1rem',
  margin: 0,
  display: 'grid',
  li: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: '8px',
    backgroundColor: theme.palette.background.level2,
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.background.level1,
    },
  },
}));

const CopyButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  top: '4.5rem',
  right: '1rem',
  padding: '0.5rem',
  borderRadius: '50%',
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    transform: 'scale(1.1)',
  },
}));

const FilterButton = styled(Button)(({ theme, variant }) => ({
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  textTransform: 'none',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  ...(variant === 'contained' && {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  }),
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  mt: 1,
  borderRadius: '12px',
  boxShadow: 4,
  '& .MuiTableHead-root': {
    backgroundColor: theme.palette.primary.light,
    '.MuiTableCell-root': {
      color: theme.palette.primary.contrastText,
      fontWeight: 600,
    },
  },
  '& .MuiTableRow-root': {
    '&:hover': {
      backgroundColor: theme.palette.background.level1,
    },
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.background.level2,
    },
  },
  '& .MuiTableCell-root': {
    py: 1.25,
    '&:first-of-type': {
      width: '100px',
    },
  },
}));

const ticketsForSecond = (data) => {
  let newData = [];
  data.forEach(row => {
    if (row['Заголовок'] !== undefined) {
      // Проверяем, есть ли в строке "(" и сразу после нее цифра
      if (/\(\d/.test(row['Заголовок'])) {
        newData.push(row);
      }
    }
  });
  return newData;
}

const splitingTickets = (data) => {
  let singleTickets = [];
  let jointTickets = [];
  data.forEach(row => {
    if (row['Назначено - Специалист'] !== undefined) {
      let dataStr = row['Назначено - Специалист'].split(' ');
      if (dataStr.length < 3) {
        singleTickets.push(row);
      } else {
        jointTickets.push(row);
      }
    }
  });
  return { singleTickets, jointTickets };
}

const prepareTickets = (data) => {
  let preTick = [];
  data.forEach(row => {
    preTick.push(new Ticket(row['ID'], row['Заголовок'], row['Назначено - Специалист'], getMark(row['Заголовок'])))
  })
  return preTick;
}


const uniqueOperators = (data) => {
  let operators = [];
  data.forEach(row => {
    operators.push(row['Назначено - Специалист']);
  });
  return new Set(operators);
}

const getMark = (data) => {
  if (data.indexOf('(') !== -1) {
    const matches = data.match(/\([^)]*\d[^)]*\)/g);
    if (matches) {
      const lastMatch = matches[matches.length - 1];
      const numberMatch = lastMatch.match(/\d+/);
      return numberMatch ? numberMatch[0] : '';
    }
  }
  return '';
}

class Ticket {
  constructor(id, header, operators, mark) {
    this.id = id;
    this.header = header;
    this.operators = operators;
    this.mark = mark;
  }
}

const columnHeaders = {
  ID: 'ID',
  Заголовок: 'Заголовок',
  'Назначено - Специалист': 'Операторы',
  Балл: 'Балл'
};


export const DataPage = ({ data }) => {
  const [selectedOperator, setSelectedOperator] = React.useState('Все');
  const [selectedMark, setSelectedMark] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [jointData, setJointData] = React.useState(false);

  const filteredData = React.useMemo(() => {
    const processedData = prepareTickets(
      splitingTickets(ticketsForSecond(data)).singleTickets
    );
    return selectedOperator === 'Все'
      ? processedData
      : processedData.filter(ticket => ticket.operators === selectedOperator);
  }, [data, selectedOperator]);


  const statistics = React.useMemo(() => {
    const stats = {};
    let totalSum = 0;
    filteredData.forEach(ticket => {
      const mark = ticket.mark;
      if (mark) {
        stats[mark] = (stats[mark] || 0) + 1;
        totalSum += parseInt(mark);
      }
    });
    return {
      distribution: stats,
      totalSum: totalSum
    };
  }, [filteredData]);

  useEffect(() => {
    const filteredJointTicketsData = async () => {
        const processedData = splitingTickets(ticketsForSecond(data)).jointTickets;
        let jointData = [];
        processedData.forEach(row => {
            let dataStr = row['Назначено - Специалист'].split(' ');
            dataStr.forEach(el => {
                if(selectedOperator.includes(el)) {
                    jointData.push(new Ticket(row['ID'], row['Заголовок'], row['Назначено - Специалист'], getMark('-')))
                }
            })
            
        })
        if(jointData) {
            setJointData(jointData);  
        }
    }
    filteredJointTicketsData()
  }, [data, selectedOperator]);



  const finalFilteredData = React.useMemo(() => {
    // return selectedMark === ''
    //   ? filteredData
    //   : filteredData.filter(ticket => ticket.mark === selectedMark);
    if(selectedMark === '-') {
        return jointData;
    } else if(selectedMark === ''){
        return filteredData;
    } else return filteredData.filter(ticket => ticket.mark === selectedMark);
  }, [filteredData, selectedMark, jointData]);

  const marks = React.useMemo(() => {
    return Array.from(new Set(filteredData.map(ticket => ticket.mark)))
      .filter(Boolean)
      .sort((a, b) => parseInt(a) - parseInt(b));
  }, [filteredData]);



  const handleCopyStats = async () => {
    const statsText = `Статистика оператора ${selectedOperator}:
Общее количество заявок: ${filteredData.length}
Сумма баллов: ${statistics.totalSum}
Распределение по баллам:
${Object.entries(statistics.distribution)
        .map(([mark, count]) => `   ${mark} - ${count} заявок`)
        .join('\n')}`;
    try {
      await navigator.clipboard.writeText(statsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Ошибка при копировании:', err);
    }
  };

  if (!data || data.length === 0) return null;

  const operators = Array.from(uniqueOperators(splitingTickets(ticketsForSecond(data)).singleTickets));

  return (
    <Container maxWidth="lg" sx={{ px: 3, py: 4 }}>
      <Divider sx={{ mb: 4 }} />
      <Title>РЕЗУЛЬТАТОШНАЯ</Title>
      {/* Контейнер для кнопок фильтрации */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <FilterButton
          variant={selectedOperator === 'Все' ? 'contained' : 'outlined'}
          onClick={() => setSelectedOperator('Все')}
        >
          Все
        </FilterButton>
        {operators.map(operator => (
          <FilterButton
            key={operator}
            variant={selectedOperator === operator ? 'contained' : 'outlined'}
            onClick={() => setSelectedOperator(operator)}
          >
            {operator}
          </FilterButton>
        ))}
      </Box>
      {/* Статистический блок */}
      <StatsBox elevation={4}>
        <CopyButton
          onClick={handleCopyStats}
          aria-label="Копировать статистику"
        >
          <Tooltip title={copied ? 'Скопировано!' : 'Копировать статистику'}>
            <FileCopyIcon sx={{ fontSize: '1.5rem' }} />
          </Tooltip>
        </CopyButton>
        <StatsHeader>Статистика оператора {selectedOperator}:</StatsHeader>
        <StatsValue>
          Общее количество заявок - {filteredData.length}
        </StatsValue>
        <StatsValue>
          Сумма баллов - {statistics.totalSum}
        </StatsValue>
        <StatsValue>
          Распределение по баллам:
        </StatsValue>
        <StatsList>
          {Object.entries(statistics.distribution).map(([mark, count]) => (
            <li key={mark}>
              <span>{mark} - {count} заявок</span>
            </li>
          ))}
        </StatsList>
      </StatsBox>
      <Divider sx={{ mb: 4 }} />
      <Title>Список заявок</Title>
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <FilterButton
          variant={selectedMark === '' ? 'contained' : 'outlined'}
          onClick={() => setSelectedMark('')}
        >
          Все
        </FilterButton>
        {marks.map(mark => (
          <FilterButton
            key={mark}
            variant={selectedMark === mark ? 'contained' : 'outlined'}
            onClick={() => setSelectedMark(mark)}
          >
            {mark}
          </FilterButton>
        ))}
        {jointData.length !== 0 && (
            <FilterButton
                variant={selectedMark === '-' ? 'contained' : 'outlined'}
                onClick={() => {
                    setSelectedMark('-')
                }}
            >
                Совместные заявки(необработанные)
            </FilterButton>)}
      </Box>
      {/* Таблица с данными */}
      <StyledTableContainer component={Paper}>
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {Object.entries(columnHeaders).map(([key, header]) => (
                <TableCell
                  key={key}
                  sx={{
                    fontWeight: 600,
                    color: 'primary.contrastText',
                    bgcolor: 'primary.light',
                    py: 1.5,
                    borderBottomColor: 'primary.light',
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalFilteredData.map((row, index) => (
              <TableRow
                key={index}
                sx={{
                  '&:nth-of-type(even)': {
                    bgcolor: 'background.level2',
                  },
                  '&:hover': {
                    bgcolor: 'background.level1',
                  },
                }}
              >
                {Object.entries(row).map(([key, value]) => (
                  <TableCell key={key} sx={{ py: 1.25 }}>
                    {key === 'id' ? (
                      <Link
                        href={`https://helpdesk.mkod.ru/front/ticket.form.php?id=${value}`}
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
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </Container>
  );
};

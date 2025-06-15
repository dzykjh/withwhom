'use client';
import React, { useState } from 'react';
import { Box, Button, Typography, TextField, ToggleButton, ToggleButtonGroup, Paper, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';

const categories = ['핫플레이스', '팝업스토어', '식당'];
const companions = [
  { label: '혼자', value: '혼자', size: 1 },
  { label: '연인', value: '연인', size: 2 },
  { label: '친구', value: '친구' },
  { label: '가족', value: '가족' },
  { label: '동료', value: '동료' },
];

export default function Home() {
  const router = useRouter();
  const [category, setCategory] = useState('핫플레이스');
  const [companion, setCompanion] = useState('혼자');
  const [groupSize, setGroupSize] = useState(1);

  const handleCategory = (_: any, newValue: string) => {
    if (newValue) setCategory(newValue);
  };
  const handleCompanion = (_: any, newValue: string) => {
    if (newValue) {
      setCompanion(newValue);
      const found = companions.find(c => c.value === newValue);
      if (found && found.size) setGroupSize(found.size);
      else setGroupSize(3);
    }
  };
  const handleGroupSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSize(Number(e.target.value));
  };
  const isDisabled = companion === '혼자' || companion === '연인';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/map?category=${category}&companion_type=${companion}&group_size=${groupSize}`);
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bgcolor="#f7f8fa">
      <Typography variant="h3" fontWeight={700} color="#3b5bfd" mb={6}>
        Withwhom?
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 3, minWidth: 350 }}>
        <Typography variant="h6" mb={2}>어디로 가시나요?</Typography>
        <ToggleButtonGroup value={category} exclusive onChange={handleCategory} fullWidth>
          {categories.map(c => (
            <ToggleButton key={c} value={c}>{c}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>
      <Paper elevation={3} sx={{ p: 4, mb: 3, minWidth: 350 }}>
        <Typography variant="h6" mb={2}>누구와 함께하시나요?</Typography>
        <ToggleButtonGroup value={companion} exclusive onChange={handleCompanion} fullWidth>
          {companions.map(c => (
            <ToggleButton key={c.value} value={c.value}>{c.label}</ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Paper>
      <Paper elevation={3} sx={{ p: 4, mb: 3, minWidth: 350 }}>
        <Typography variant="h6" mb={2}>몇 명이서 가시나요?</Typography>
        <TextField
          type="number"
          value={groupSize}
          onChange={handleGroupSize}
          disabled={isDisabled}
          inputProps={{ min: 1, max: 20 }}
          fullWidth
          placeholder="인원수 입력"
        />
      </Paper>
      <Button variant="contained" size="large" onClick={handleSubmit} sx={{ mt: 2, minWidth: 200 }}>
        추천 장소 보기
      </Button>
    </Box>
  );
}

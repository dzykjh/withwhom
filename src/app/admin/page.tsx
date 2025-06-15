"use client";
import React, { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, IconButton, MenuItem, Grid, Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';

interface Place {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address?: string;
  summary?: string;
  description?: string;
  minGroupSize?: number;
  maxGroupSize?: number;
  startDate?: string;
  endDate?: string;
  images?: string[];
  companions?: string[];
}

const categories = ["핫플레이스", "팝업스토어", "식당"];
const companionOptions = ["혼자", "연인", "친구", "가족", "동료"];

const initialPlaces: Place[] = [
  { id: "1", name: "맛집1", category: "식당", lat: 37.5665, lng: 126.978, address: "서울시", summary: "서울의 맛집", description: "서울의 유명한 맛집입니다.", minGroupSize: 2, maxGroupSize: 6 },
  { id: "2", name: "핫플1", category: "핫플레이스", lat: 37.5651, lng: 126.9895, address: "서울시", summary: "요즘 핫한 곳", description: "젊은이들이 많이 찾는 핫플레이스.", minGroupSize: 1, maxGroupSize: 10 },
];

export default function AdminPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [form, setForm] = useState<Partial<Place>>({ category: categories[0] });

  // DB에서 장소 목록 불러오기
  useEffect(() => {
    fetch("/api/places")
      .then(res => res.json())
      .then(data => {
        setPlaces(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleOpen = (idx?: number) => {
    if (typeof idx === 'number') {
      setEditIdx(idx);
      setForm(places[idx]);
    } else {
      setEditIdx(null);
      setForm({ category: categories[0] });
    }
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setForm({ category: categories[0] });
    setEditIdx(null);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCompanionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name;
    setForm(f => {
      const arr = f.companions || [];
      if (e.target.checked) {
        return { ...f, companions: [...arr, value] };
      } else {
        return { ...f, companions: arr.filter(v => v !== value) };
      }
    });
  };
  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.lat || !form.lng) return;
    const payload = { ...form };
    if (editIdx !== null) {
      // 수정
      const id = places[editIdx]._id || places[editIdx].id;
      const res = await fetch(`/api/places/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const updated = await res.json();
      setPlaces(places => places.map((p, i) => i === editIdx ? updated : p));
    } else {
      // 추가
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const created = await res.json();
      setPlaces(places => [created, ...places]);
    }
    handleClose();
  };
  const handleDelete = async (idx: number) => {
    const id = places[idx]._id || places[idx].id;
    await fetch(`/api/places/${id}`, { method: "DELETE" });
    setPlaces(places => places.filter((_, i) => i !== idx));
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArr = Array.from(files).slice(0, 4 - (form.images?.length || 0));
    Promise.all(fileArr.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(imgs => {
      setForm(f => ({ ...f, images: [...(f.images || []), ...imgs] }));
    });
  };
  const handleImageDelete = (idx: number) => {
    setForm(f => ({ ...f, images: (f.images || []).filter((_, i) => i !== idx) }));
  };

  // loading 처리 추가
  if (loading) return <Box p={4}><Typography>로딩 중...</Typography></Box>;

  return (
    <Box minHeight="100vh" bgcolor="#f7f8fa" p={4}>
      <Typography variant="h4" fontWeight={700} color="#3b5bfd" mb={4}>
        관리자 페이지
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">장소 리스트</Typography>
          <Button variant="contained" onClick={() => handleOpen()}>장소 추가</Button>
        </Box>
        <List>
          {places.map((place, idx) => (
            <ListItem key={place.id} secondaryAction={
              <>
                <IconButton edge="end" onClick={() => handleOpen(idx)}><EditIcon /></IconButton>
                <IconButton edge="end" color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
              </>
            }>
              <ListItemText primary={place.name} secondary={`${place.category} (${place.lat}, ${place.lng})`} />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx !== null ? '장소 수정' : '장소 추가'}</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField margin="dense" label="장소명" name="name" value={form.name || ''} onChange={handleChange} fullWidth required />
            </Grid>
            <Grid item xs={12}>
              <TextField select margin="dense" label="카테고리" name="category" value={form.category || categories[0]} onChange={handleChange} fullWidth required>
                {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField margin="dense" label="위도(lat)" name="lat" value={form.lat || ''} onChange={handleChange} fullWidth required type="number" />
            </Grid>
            <Grid item xs={6}>
              <TextField margin="dense" label="경도(lng)" name="lng" value={form.lng || ''} onChange={handleChange} fullWidth required type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField margin="dense" label="주소" name="address" value={form.address || ''} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <TextField margin="dense" label="최소 인원" name="minGroupSize" value={form.minGroupSize || ''} onChange={handleChange} fullWidth type="number" />
            </Grid>
            <Grid item xs={6}>
              <TextField margin="dense" label="최대 인원" name="maxGroupSize" value={form.maxGroupSize || ''} onChange={handleChange} fullWidth type="number" />
            </Grid>
            <Grid item xs={12}>
              <TextField margin="dense" label="대표소개" name="summary" value={form.summary || ''} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField margin="dense" label="상세소개" name="description" value={form.description || ''} onChange={handleChange} fullWidth multiline minRows={2} />
            </Grid>
            {form.category === '팝업스토어' && (
              <>
                <Grid item xs={6}>
                  <TextField margin="dense" label="시작일자" name="startDate" value={form.startDate || ''} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField margin="dense" label="종료일자" name="endDate" value={form.endDate || ''} onChange={handleChange} fullWidth type="date" InputLabelProps={{ shrink: true }} />
                </Grid>
              </>
            )}
            <Grid item xs={12}>
              <Box mb={1}>
                <Typography fontSize={14} fontWeight={600} mb={0.5}>이미지 업로드 (최대 4장)</Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  disabled={(form.images?.length || 0) >= 4}
                >
                  이미지 선택
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageChange}
                    disabled={(form.images?.length || 0) >= 4}
                  />
                </Button>
              </Box>
              <Box display="flex" gap={1} flexWrap="wrap">
                {(form.images || []).map((img, idx) => (
                  <Box key={idx} position="relative" width={70} height={70} borderRadius={1} overflow="hidden" border={1} borderColor="#ddd">
                    <img src={img} alt={`img${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, bgcolor: '#fff' }} onClick={() => handleImageDelete(idx)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography fontSize={14} fontWeight={600} mb={0.5}>누구와 함께 가는지</Typography>
              <FormGroup row>
                {companionOptions.map(opt => (
                  <FormControlLabel
                    key={opt}
                    control={<Checkbox checked={(form.companions || []).includes(opt)} onChange={handleCompanionsChange} name={opt} />}
                    label={opt}
                  />
                ))}
              </FormGroup>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleSubmit} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
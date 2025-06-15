"use client";
import { useSearchParams } from "next/navigation";
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider, Select, MenuItem, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import CloseIcon from '@mui/icons-material/Close';
import Link from "next/link";

// Leaflet은 SSR에서 window가 없으면 에러가 나므로 dynamic import
const Map = dynamic(() => import("../../components/MapView"), { ssr: false });

interface Place {
  _id: string;
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

export default function MapPage() {
  const params = useSearchParams();
  const category = params.get("category") || "식당";
  const companion = params.get("companion_type") || "친구";
  const groupSize = Number(params.get("group_size") || "2");
  const [filter, setFilter] = useState("전체");
  const [places, setPlaces] = useState<Place[]>([]);
  const [selected, setSelected] = useState<Place|null>(null);

  useEffect(() => {
    fetch("/api/places")
      .then(res => res.json())
      .then(data => setPlaces(data));
  }, []);

  // 조건에 맞는 장소만 필터링
  const filtered = places.filter(p => {
    if (filter !== "전체" && p.category !== filter) return false;
    if (category && p.category !== category) return false;
    if (p.minGroupSize && groupSize < p.minGroupSize) return false;
    if (p.maxGroupSize && groupSize > p.maxGroupSize) return false;
    // companions 조건 추가
    if (p.companions && p.companions.length > 0 && !p.companions.includes(companion)) return false;
    // 팝업스토어 기간 체크(오늘 날짜 기준)
    if (p.category === "팝업스토어" && p.startDate && p.endDate) {
      const today = new Date();
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      if (today < start || today > end) return false;
    }
    return true;
  });

  return (
    <Box minHeight="100vh" bgcolor="#f7f8fa" p={4}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Typography variant="h4" fontWeight={700} color="#3b5bfd" mb={4} sx={{ cursor: 'pointer' }}>
          Withwhom?
        </Typography>
      </Link>
      <Typography variant="h6" mb={2}>
        {`${category}/${companion}/${groupSize}에 추천하는 장소`}
      </Typography>
      <Box display="flex" gap={4}>
        <Paper elevation={3} sx={{ p: 2, width: 600, height: 500 }}>
          <Typography fontWeight={600} mb={1}>서울 지역 지도</Typography>
          <Map places={filtered} onMarkerClick={setSelected} />
        </Paper>
        <Paper elevation={3} sx={{ p: 2, width: 350, height: 500, overflowY: 'auto' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Typography fontWeight={600} flex={1}>List</Typography>
            <Select size="small" value={filter} onChange={e => setFilter(e.target.value)}>
              <MenuItem value="전체">전체</MenuItem>
              <MenuItem value="핫플레이스">핫플레이스</MenuItem>
              <MenuItem value="팝업스토어">팝업스토어</MenuItem>
              <MenuItem value="식당">식당</MenuItem>
            </Select>
          </Box>
          <Divider />
          <List>
            {filtered.map(place => (
              <ListItem key={place._id} component="button" onClick={() => setSelected(place)}>
                <ListItemText primary={place.name} secondary={place.category} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
      {/* 상세 정보 다이얼로그 */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selected?.name}
          <IconButton onClick={() => setSelected(null)} sx={{ position: 'absolute', right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selected?.images && selected.images.length > 0 && (
            <Box mb={2} display="flex" gap={1}>
              {selected.images.map((img, idx) => (
                <img key={idx} src={img} alt={`img${idx}`} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8 }} />
              ))}
            </Box>
          )}
          <Typography fontWeight={600}>{selected?.category}</Typography>
          <Typography color="text.secondary">{selected?.address}</Typography>
          <Typography mt={1}>{selected?.summary}</Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>{selected?.description}</Typography>
          {selected?.category === '팝업스토어' && selected.startDate && selected.endDate && (
            <Typography mt={1} color="primary.main">{`운영기간: ${selected.startDate} ~ ${selected.endDate}`}</Typography>
          )}
          <Typography mt={1} color="text.secondary">추천 인원: {selected?.minGroupSize} ~ {selected?.maxGroupSize}명</Typography>
        </DialogContent>
      </Dialog>
      <Box mt={6} textAlign="center" color="#aaa">
        © 2024 Withwhom? All rights reserved.
      </Box>
    </Box>
  );
} 
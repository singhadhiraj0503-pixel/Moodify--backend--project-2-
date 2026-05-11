import { useContext } from "react";
import { SongContext } from "../song.context";
import { getSong } from "../services/song.api";

export const useSong = () => {
  const context = useContext(SongContext);

  const { song, setsong, loading, setloading } = context;

  const handleGetSong = async ({ mood }) => {
    setloading(true);
    const data = await getSong({ mood });
    setsong(data.song);
    setloading(false);
  };

  return { song, loading, handleGetSong };
};

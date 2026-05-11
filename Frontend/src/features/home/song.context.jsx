import { createContext, useState } from "react";

export const SongContext = createContext();

export const SongContextProvider = ({ children }) => {
  const [song, setsong] = useState({
    url: "https://ik.imagekit.io/marteeen/cohort-2/moodify/songs/MERE_BINA____KSHMRmusic___The_PropheC____TalhaAnjum____Official_Audio____Karam_U-a_seDBl.mp3",
    posterUrl: "",
    title:
      "MERE BINA | @KSHMRmusic | The PropheC | @TalhaAnjum  | Official Audio | #Karam",
    mood: "happy",
    __v: 0,
  });

  const [loading, setloading] = useState(false);

  return (
    <SongContext.Provider value={{ song, setsong, loading, setloading }}>
      {children}
    </SongContext.Provider>
  );
};

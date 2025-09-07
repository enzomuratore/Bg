
Bon Giorno — Avatar (menu.html: ekran główny)

Pliki w ZIPie:
- avatar.png — okrągła ikonka 512×512 z delikatną, złotą ramką
- README.txt — ta instrukcja

Szybka instrukcja (iPhone → GitHub app):
1) Otwórz aplikację GitHub → znajdź repo: enzo... / Bg → Code.
2) Naciśnij „…”, wybierz: Upload photo/file → wybierz plik „avatar.png” z tego ZIPa.
   (Jeśli nie widzisz przycisku, wejdź w plik „index.html”, wróć „Back” i ponownie „…”.)
3) Commit message wpisz: add avatar.png → Commit.
4) Vercel sam zrobi deploy (zwykle 15–60 sek.). Odśwież stronę.
5) Jeśli avatar nadal jest pusty, otwórz w repo plik „menu.html” i upewnij się, że
   w sekcji nagłówka/profilu jest obrazek np.:
      <img src="avatar.png" alt="Avatar Maciej" class="avatar">
   albo styl z tłem:
      .avatar { background-image: url('avatar.png'); }

W razie czego — dodaj awatar inline:
  - Edytuj „menu.html” i dodaj w <head>:
      <style>
        .avatar{width:64px;height:64px;border-radius:50%;object-fit:cover;
                border:4px solid #d9b24c; box-shadow:0 2px 6px rgba(0,0,0,.15);}
      </style>
  - W miejscu pustego kółka wstaw:
      <img src="avatar.png" alt="Avatar Maciej" class="avatar">

Powodzenia!

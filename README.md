# Leaflet beadandó projekt: Pet-Locator

## Futtatás:

### A projekt futtatásához szükséges eszközök:

- npm (https://www.npmjs.com/package/npm)
- nodejs (https://nodejs.org/en)

### Futtatás menete:

1. pet-locator/backend mappába navigálás
2. npm i
3. npm start
4. pet-locator/index.html megnyitása

## A projekt leírása:

Régóta szeretnék egy webalkalmazást csináli, ami az elveszett háziállatok keresésését segíti. Ezzel a projekttel egy "alfa" verziót szerettem volna létrehozni.  
Egyrészt új elkóborolt állatok felvivését teszi lehetővé jelölőkkel, másrészt azokon "keresést" hajthatunk végre, ami most csak egy adott területre szűkíthető.
Amennyiben tovább vinném ezt a projektet, érdemes lenne keresésést kritériumokra is kiterjeszteni (cica, öreg, barna, ...). Ezen kívül rengeteg más funkciót is el tudok képzelni, amivel bővíteni lehetne, mint például képek feltöltésének lehetősége.

## Funkcionalitások magyarázása:

- **Interaktív jelölő**: A felhasználó kattintásait követő, húzva is mozgatható jelölő. Ez teszi lehetővé a többi funkcionalitás működését, ezzel tehet tetszőleges helyre jelölőt a felhasználó, valamit a keresés középpontja is ez.
- **Jelölő hozzáadása**: Az "Add" gombra kattintva egy felugró ablakban adhatjuk meg a megtalált háziállat adatait. Ezek után a jelölő mentésre kerül a lokálisan futó backend alkalmazáson keresztül egy geoJSON állományba. A térkép betöltésekor szintén a backend alkalmazásból olvasódnak be ezek a hozzáadott jelölők!
- **Keresés**: A mostani keresés limitált, amennyiben a "kereső körön" beül tartózkodik egy jelölő, annak megnyílik a bubija. A kereső kör a "Cancel" gombbal tüntethető el. A rétegek kezelése befolyásolja a keresési eredményeket!
- **Image Overlay megmutatás**: Megmutatja a teljesítséhez szükséges átfedő képet a térképen.

## Források

### Kódrészletek:

- Modal: https://getbootstrap.com/docs/4.3/components/modal/
- Slider: https://www.encodedna.com/html5/howto-read-values-from-html5-input-type-range-using-javascript.htm
- Backend: https://intellipaat.com/blog/rest-api-with-node-js/

### Képek:

- Cat icon: https://adioma.com/icons/cat
- Dog icon: https://adioma.com/icons/dog
- kérdőjel icon: https://adioma.com/icons/question-mark
- arrow icon: https://adioma.com/icons/down-arrow

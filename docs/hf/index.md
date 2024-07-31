# Házi feladat információk

A házi feladat célja, hogy az előadáson és laborokon bemutatott technológiák segítségével egy komplex alkalmazást készítsen a hallgató, önálló funkcionalitással.

## Követelmények

-	Legalább 4 technológia használata pl:
	* UI
	* Egyedi nézetek
	* Perzisztens adattárolás
	* Animációk
	* Stílusok/témák
	* LazyColumn
	* Hálózati kommunikáció
	* Service
	* BroadcastReceiver
	* Content Provider
	* Intent
	* Stb
-	Kotlin nyelven kell készülnie
-	Jetpack Compose-val kell készülnie
-	Önálló alkalmazás legalább 3-4 képernyővel/nézettel
-	Bármilyen külső könyvtár használható a fejlesztéshez, hogy még látványosabb alkalmazások készüljenek:
	-	[https://github.com/wasabeef/awesome-android-ui](https://github.com/wasabeef/awesome-android-ui)
	-	[https://github.com/wasabeef/awesome-android-libraries](https://github.com/wasabeef/awesome-android-libraries)
	-	[https://github.com/nisrulz/android-tips-tricks](https://github.com/nisrulz/android-tips-tricks)

!!!tip "Néhány példa alkalmazás"
	-	Kiadás/bevétel nyomkövető figyelmeztető funkcióval és grafikonokkal
	-	Turisztikai látványosságokat gyűjtő alkalmazás
	-	Raktár kezelő alkalmazás
	-	Számla kezelő megoldás
	-	Recept kezelő alkalmazás
	-	Napló készítő alkalmazás fényképekkel
	-	Sport tracker alkalmazás
	-	Készülék esemény naplózó alkalmazás
	-	Apróhirdetés alkalmazás
	-	Találkozó szervező alkalmazás
	-	Sportfogadó megoldás
	-	Szaki kereső alkalmazás
	-	Játék alkalmazás, pl. aknakereső, shooter, stb.
	-	Valamilyen REST API-t használó alkalmazás, például valuta váltás, tőzsdei infók, stb:
		-	[https://github.com/toddmotto/public-apis](https://github.com/toddmotto/public-apis)
		-	[https://github.com/Kikobeats/awesome-api](https://github.com/Kikobeats/awesome-api)
		-	[https://github.com/abhishekbanthia/Public-APIs](https://github.com/abhishekbanthia/Public-APIs)
	-	A házi feladat használhat felhő megoldást is, pl. Firebase, Amazon, stb.

## Beadás módja

!!!danger "neptun.txt"
	Az első és legfontosabb, hogy az eddigiekhez hasonlóan töltsd ki a neptun.txt fájlt, hogy a rendszer azonosítani tudjon.

### Specifikáció

A specifikáció beadás határideje a **7. hét vége (2024. október 20. 23:59)**.
A specifikáció elkészítése közben a "spec" branchen dolgozz. Erre az ágra akárhány kommitot tehetsz.
Sablont a README.md fájl tartalmaz, azt kell kiegészíteni, és feltölteni a repóba a megadott határidőig.
A beadás akkor teljes, ha a "spec" branch-en megtalálható a README.md fájlban a specifikáció. A beadást egy pull request jelzi, amely pull request-et a laborvezetődhöz kell rendelned.
A specifikáció elkészítése előfeltétele a házi feladat elfogadásának.

### Házi feladat

A házi feladat beadás határideje a **11. hét vége (2024. november 17. 23:59)**.
A házi feladat elkészítése közben a "hf" branchen dolgozz. Erre az ágra akárhány kommitot tehetsz. 
A projektet mindenképpen ebbe a repository-ba hozd létre, a fejlesztést végig itt végezd.
A beadás akkor teljes, ha a "hf" branch-en megtalálható a projekted teljes forráskódja. A beadást egy pull request jelzi, amely pull request-et a laborvezetődhöz kell rendelned.
A házi feladathoz mindenképpen tartozik **házi feladat védés** is. Ennek ideje a beadást követően (a 12-13. héten) van. Módjáról és idejéről egyeztess a laborvezetőddel.

### Házi feladat pótlás - fizetésköteles!

A pótbeadás határideje a **13. hét vége (2024. december 1. 23:59)**.
A házi feladat pótlása közben a "pothf" branchen dolgozz. Erre az ágra akárhány kommitot tehetsz. 
A beadás akkor teljes, ha a "pothf" branch-en megtalálható a projekted teljes forráskódja. A beadást egy pull request jelzi, amely pull request-et a laborvezetődhöz kell rendelned.
A házi feladat pótlásához mindenképpen tartozik **pót házi feladat védés** is. Ennek ideje a beadást követően (a 14. héten) van. Módjáról és idejéről egyeztess a laborvezetőddel.

!!!danger "FONTOS: Elővizsga"
	Az elővizsgára jelentkezés feltétele a házi feladat normál határidőre való leadása. Aki mégis jelentkezik elővizsgára úgy, hogy pót házit adott le, annak a vizsgáját nem javítjuk, automatikusan elégtelen kerül beírásra.

## Dokumentáció

A házi feladatot a specifikáción túl dokumentálni nem szükséges.

## iMSc pontok

A házi feladat minimumkövetelményeinek túlteljesítéséért, extra funkciókért, igényes felületért, kiemelkedő kódminőségért a laborvezetővel egyeztetve maximum 10 iMSc pont szerezhető.
iMSc pont szerzéséhez az elkészült alkalmazásról rövid dokumentációt kell készíteni a README.md fájlba. (A specifikáció után.) Ebben röviden ismertetni kell az elkészült alkalmazás funkcionalitását és az érdekesebb megoldásokat.

!!!tip "Androidalapú szoftverfejlesztés + Mobil- és webes szoftverek közös házi feladat"
	Ha valaki mind a két tárgyat hallgatja a félévben, van lehetőség közös házi feladat írására, DE:
	- Ezt mindenképpen egyeztetni kell mindkét laborvezetővel.
	- Ugyanaz a házi csak úgy adható le mindkét tárgyon, ha a nehezebb követelményeket (vagyis az Androidalapú szoftverfejlesztését) felülteljesíti. Tehát az Androidalapú szoftverfejlesztés követelményei szerint nem 5, hanem 6-7 technológiát kell használni. Ennek mennyiségéről és a feladat komplexitásáról a laborvezetők döntenek.
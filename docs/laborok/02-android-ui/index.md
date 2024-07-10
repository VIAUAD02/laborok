# Labor 02 - Felhasználói felület készítés

## Bevezető

A labor során egy tömegközlekedési vállalat számára megálmodott alkalmazás vázát készítjük el. Az alkalmazással a felhasználók különböző járművekre vásárolhatnak majd bérleteket. Az üzleti logikát (az authentikációt, a bevitt adatok ellenőrzését, a fizetés lebonyolítását) egyelőre csak szimulálni fogjuk, a labor fókusza a felületek és a köztük való navigáció elkészítése lesz.

<p align="center">
<img src="./assets/splash.png" width="19%">
<img src="./assets/login.png" width="19%">
<img src="./assets/list.png" width="19%">
<img src="./assets/details.png" width="19%">
<img src="./assets/pass.png" width="19%">
</p>

!!! warning "IMSc"
	A laborfeladatok sikeres befejezése után az IMSc feladat-ot megoldva 2 IMSc pont szerezhető.

## Előkészületek

A feladatok megoldása során ne felejtsd el követni a [feladat beadás folyamatát](../../tudnivalok/github/GitHub.md).

### Git repository létrehozása és letöltése

1. Moodle-ben keresd meg a laborhoz tartozó meghívó URL-jét és annak segítségével hozd létre a saját repository-dat.

1. Várd meg, míg elkészül a repository, majd checkout-old ki.

    !!! tip ""
        Egyetemi laborokban, ha a checkout során nem kér a rendszer felhasználónevet és jelszót, és nem sikerül a checkout, akkor valószínűleg a gépen korábban megjegyzett felhasználónévvel próbálkozott a rendszer. Először töröld ki a mentett belépési adatokat (lásd [itt](../../tudnivalok/github/GitHub-credentials.md)), és próbáld újra.

1. Hozz létre egy új ágat `megoldas` néven, és ezen az ágon dolgozz.

1. A `neptun.txt` fájlba írd bele a Neptun kódodat. A fájlban semmi más ne szerepeljen, csak egyetlen sorban a Neptun kód 6 karaktere.


!!! info "Android, Java, Kotlin"
	Az Android hagyományosan Java nyelven volt fejleszthető, azonban az utóbbi években a Google átállt a [Kotlin](https://kotlinlang.org/) nyelvre. Ez egy sokkal modernebb nyelv, mint a Java, sok olyan nyelvi elemet ad, amit kényelmes használni, valamint új nyelvi szabályokat, amikkel például elkerülhetőek a Java nyelven gyakori `NullPointerException` jellegű hibák.

	Másrészről viszont a nyelv sok mindenben tér el a hagyományosan C jellegű szintaktikát követő nyelvektől, amit majd látni is fogunk. A labor előtt érdemes megismerkedni a nyelvvel, egyrészt a fent látható linken, másrészt [ezt](https://developer.android.com/kotlin/learn) az összefoglaló cikket átolvasva.

## Projekt létrehozása

Első lépésként indítsuk el az Android Studio-t, majd:

1. Hozzunk létre egy új projektet, válasszuk az *Empty Activity* lehetőséget.
2. A projekt neve legyen `PublicTransport`, a kezdő package `hu.bme.aut.android.publictransport`, a mentési hely pedig a kicheckoutolt repository-n belül a PublicTransport mappa.
3. Nyelvnek válasszuk a *Kotlin*-t.
4. A minimum API szint legyen API24: Android 7.0.
5. A *Build configuration language* Kotlin DSL legyen.

!!!danger "FILE PATH"
	A projekt a repository-ban lévő PublicTransport könyvtárba kerüljön, és beadásnál legyen is felpusholva! A kód nélkül nem tudunk maximális pontot adni a laborra!

!!!info ""
	A projekt létrehozásakor, a fordító keretrendszernek rengeteg függőséget kell letöltenie. Amíg ez nem történt meg, addig a projektben nehézkes navigálni, hiányzik a kódkiegészítés, stb... Éppen ezért ezt tanácsos kivárni, azonban ez akár 5 percet is igénybe vehet az első alkalommal! Az ablak alján látható információs sávot kell figyelni.

Láthatjuk, hogy létrejött egy projekt, amiben van egy Activity, `MainActivity` néven, ez be is lett írva automatikusan a *Manifest* fájlba mint Activity. Ezután nyissuk meg a

- Modul szintű `build.gradle.kts` fájlt (*app -> build.gradle.kts*)
- Illetve a `libs.version.toml` fájlt (*gradle -> libs.versions.toml*)

Ezt a kettőt úgy tudjuk elérni, hogy a bal fölső sarokban az *Android* nézetről *Project* nézetre kapcsolunk, és itt megkeressük a fenti alapján ezt a két fájlt.
Ezután másoljuk be a következő függőségeket a `libs.version.toml` fájlba:
```toml
[versions]
...
coreSplashscreen = "1.0.1"
navigationCompose = "2.7.7"

[libraries]
...
androidx-core-splashscreen = { module = "androidx.core:core-splashscreen", version.ref = "coreSplashscreen" }
androidx-navigation-compose = { module = "androidx.navigation:navigation-compose", version.ref = "navigationCompose" }
```

A `[versions]` tag-en belül adhatunk egy változó nevet, majd egy verzió értéket, amit majd a következő lépésben átadunk a `version.ref`-nek. Ez megmondja, hogy melyik verziót használja az adott modulból. A `[libraries]` tag-en belül definiálunk szintén egy változót `androidx-navigation-compose` néven, amit majd később használunk fel a `build.gradle.kts` fájlban. Ennek megadjuk, hogy melyik modul-t szeretnénk beletenni a projektbe, valamint egy verzió számot, amit korábban már definiáltunk. Hogy ha ezzel megvagyunk, nyissuk meg a `build.gradle.kts` fájlt, és adjuk hozzá a következőt a `dependencies` tag-en belülre

```kts
dependencies {
    ...
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.navigation.compose)
}
```

Hogy ha ezzel is megvagyunk kattintsunk a `Sync Now` gombra a jobb fölső sarokban, és várjuk meg míg letölti a szükséges függőségeket.

!!!warning "Sync Now"
    Hogy ha ezt a lépést kihagyjuk, akkor az Android Studio nem fogja megtalálni a szükséges elemeket, és ez később gondot okozhat!


## Splash képernyő (0.5 pont)

Miután a felhasználó elindította az alkalmazást, egy "üdvözlő/splash" képernyővel szeretnénk köszönteni. Ez egy elegáns megoldás arra, hogy az alkalmazás betöltéséig ne egy egyszínű képernyő legyen a felhasználó előtt, hanem jelen esetben egy alkalmazás logo, egy tetszőleges háttér színnel.

<p align="center">
<img src="./assets/splash.png" width="320">
</p>

???info "Android 12 (API 31) alatt"

	(A szükséges fájl [innen](./downloads/res.zip) elérhető)
	
	Hozzunk létre egy új XML fájlt a `drawable` mappában `splash_background.xml` néven. Ez lesz a splash képernyőnkön megjelenő grafika. A tartalma az alábbi legyen:
	
	```xml
	<?xml version="1.0" encoding="utf-8"?>
	<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
	
	    <item>
	        <bitmap
	            android:gravity="fill_horizontal|clip_vertical"
	            android:src="@drawable/splash_image"/>
	    </item>
	
	</layer-list>
	```
	
	Jelen esetben egyetlen képet teszünk ide, de további `item`-ek felvételével komplexebb dolgokat is összeállíthatnánk itt. Tipikus megoldás például egy egyszínű háttér beállítása, amin az alkalmazás ikonja látszik.
	
	Nyissuk meg a `values/themes.xml` fájlt. Ez definiálja az alkalmazásban használt különböző témákat. A splash képernyőhöz egy új témát fogunk létrehozni, amelyben az előbb létrehozott drawable-t állítjuk be az alkalmazásablakunk hátterének (mivel ez látszik valójában, amíg nem töltött be a UI többi része). Ezt így tehetjük meg:
	
	```xml
	<style name="SplashTheme" parent="Theme.AppCompat.NoActionBar">
	    <item name="android:windowBackground">@drawable/splash_background</item>
	</style>
	```
	
	A fenti témát illesszük be a `night` minősítővel ellátott `themes.xml` fájlba is.
	
	
	A téma használatához az alkalmazásunk manifest fájlját (`AndroidManifest.xml`) kell módosítanunk. Ezt megnyitva láthatjuk, hogy jelenleg a teljes alkalmazás az `AppTheme` nevű témát használja.
	
	```xml
	<application
	    ...
	    android:theme="@style/Theme.PublicTransport" >
	```
	
	Mi ezt nem akarjuk megváltoztatni, hanem csak a `LoginActivity`-nek akarunk egy új témát adni. Ezt így tehetjük meg:
	
	```xml
	<activity
	    android:name=".LoginActivity"
	    android:theme="@style/SplashTheme">
	    ...
	</activity>
	```
	
	Mivel a betöltés után már nem lesz szükségünk erre a háttérre, a `LoginActivity.kt` fájlban a betöltés befejeztével visszaállíthatjuk az eredeti témát, amely fehér háttérrel rendelkezik. Ezt az `onCreate` függvény elején tegyük meg, még a `super` hívás előtt:
	
	```kotlin
	override fun onCreate(savedInstanceState: Bundle?) {
	    setTheme(R.style.Theme_PublicTransport)
	    ...
	}
	```
		
	Most már futtathatjuk az alkalmazást, és betöltés közben látnunk kell a berakott képet. A splash képernyő általában akkor hasznos, ha az alkalmazás inicializálása sokáig tart. Mivel a mostani alkalmazásunk még nagyon gyorsan indul el, szimulálhatunk egy kis töltési időt az alábbi módon:
	
	```kotlin
	override fun onCreate(savedInstanceState: Bundle?) {
	    try {
	        Thread.sleep(1000)
	    } catch (e: InterruptedException) {
	        e.printStackTrace()
	    }
	    setTheme(R.style.Theme_PublicTransport);
	    ...
	}
	```


API 31 felett bevezetésre került egy [Splash Screen API](https://developer.android.com/develop/ui/views/launch/splash-screen), most ezt fogjuk használni. Ehhez már korábban felvettük a szükséges függőséget a `build.gradle.kts` fájlba.

Készítsünk el egy tetszőleges ikont, amit majd fel fogunk használni a splash képernyőnk közepén. Ehhez az Android Studio beépített `Asset Studio` eszközét fogjuk használni. Bal oldalon a *Project* fül alatt nyissuk meg a `Resource Manager`-t, majd nyomjunk a <kbd>+</kbd> gombra, ott pedig az `Image Asset` lehetőségre.

1. Itt *Launcher Icon-t* szeretnénk majd generálni, tehát válasszuk azt.
2. A neve legyen *ic_transport*
3. Az egyszerűség kedvéért most *Clip Art*-ból fogjuk elkészíteni az ikonunkat, így válasszuk azt, majd az alatta lévő gombnál válasszunk egy szimpatikusat (pl. a *bus* keresési szóval).
4. Ez után válasszunk egy szimpatikus színt.
5. Ha akarunk, állíthatunk a méretezésen is.
6. A `Background Layer` fülön beállíthatjuk a háttér színét is.
7. A beállításoknál állítsuk át, hogy az ikon *PNG* formában készüljön el.
8. Ezután nyomjunk a *Next* majd a *Finish* gombra.

<p align="center"> 
<img src="./assets/asset_studio.png">
</p>

Láthatjuk, hogy több féle ikon készült, több féle méretben. Ezekből a rendszer a konfiguráció függvényében fog választani.

A splash képernyő elkészítéséhez egy új stílust kell definiálnunk a `themes.xml` fájlban. Vegyük fel az alábbi kódrészletet a meglévő stílus alá. (A tárgy keretein belül nagyon kevés XML kóddal fogunk foglalkozni.)

```xml
<style name="Theme.PublicTransport.Starting" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">#5A3DDC</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/ic_transport_foreground</item>
    <item name="android:windowSplashScreenIconBackgroundColor">#5A3DDC</item>
    <item name="postSplashScreenTheme">@style/Theme.PublicTransport</item>
</style>
```

Az új stílusunk a `Theme.PublicTransport.Starting` nevet viseli, és a `Theme.SplashScreen` témából származik. Ezen kívül beállítottuk benne, hogy

- `windowSplashScreenBackground`: a splash képernyő háttere (természetesen más is választható),
- `windowSplashScreenAnimatedIcon`: a középen megjelenő ikon a saját ikonunk legyen, annak is csak az előtere,
- `android:windowSplashScreenIconBackgroundColor`: az ikonunk mögött milyen háttér legyen (ez is személyre szabható más színnel),
- `postSplashScreenTheme`: a splash screen után milyen stílusra kell visszaváltania az alkalmazásnak.


!!!note
	A Splash Screen API ennél jóval többet tud, akár animálhatjuk is a megjelenített képet, azonban ez sajnos túlmutat a labor keretein.

Most már, hogy bekonfiguráltuk a *splash* képernyőnket, már csak be kell állítanunk a használatát. Ehhez először az imént létrehozott stílust kell alkalmaznunk `MainActivity`-re a `manifest.xml`-ben.


```xml
<activity
    android:theme="@style/Theme.PublicTransport.Starting"
    android:name=".MainActivity"
    android:exported="true">
    ...
</activity>
```

Ezután állítsuk be az alkalmazásunk ikonját is:

```xml
<application
    ...
    android:icon="@mipmap/ic_transport_round"
    android:roundIcon="@mipmap/ic_transport_round">
    ...
</application>
```
Majd meg kell hívnunk az `installSplashScreen` függvényt az `onCreate`-ben, hogy az alkalmazás indításánál, valóban elkészüljön a *Splash Screen*.

```kotlin

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            PublicTransportTheme {
                Greeting(name = "Android")
            }
        }
    }
}
```

!!!note "Splash Screen-NavGraph"
    A Splash Screent a NavGraph segítségével is meg lehet oldani, erről a labor végén egy ismertető [feladat](#ismerteto-feladat-navgrap-splash) fog segítséget mutatni. (Ez nem szükséges a labor megszerzéséhez, a feladat nélkül is el lehet érni a maximális pontot, azonban az érdekesség kedvéért érdemes végig csinálni.)


Próbáljuk ki az alkalmazásunkat!

!!!example "BEADANDÓ (0.5 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **splash képernyő** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f1.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.


## Login képernyő (0.5 pont)

Most már elkészíthetjük a login képernyőt. A felhasználótól egy e-mail címet, illetve egy számokból álló jelszót fogunk bekérni, és egyelőre csak azt fogjuk ellenőrizni, hogy beírt-e valamit a mezőbe.

<p align="center"> 
<img src="./assets/login.png" width="320">
</p>

Ehhez először hozzunk létre egy új *Packaget* a projekt mappába `navigation` néven, majd ebbe hozzunk létre két *Kotlin Filet* (a *Package*-ünkön jobb klikk -> New -> Kotlin Class/File) `NavGraph` illetve `Screen` néven. Ez utóbbira csak azért lesz szükség, hogy a későbbiekben szebben tudjuk megoldani a navigációt a képernyők között. Ezt az [Ismertető feladat - Screen File](#ismerteto-feladat-screen-file) résznél fogjuk részletezve leírni az érdeklődők kedvéért.

Nyissuk meg a `NavGraph` fájlt, és írjuk bele a következő kódot, majd nézzük át és értelmezzük a laborvezető segítségével a kódot.

```kotlin
@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
){
    NavHost(
        navController = navController,
        startDestination = "login"
    ){
        composable("login"){
            LoginScreen(
                onSuccess = {
                    navController.navigate("list")
                }
            )
        }
    }
}
```

Miután ezzel megvagyunk, hozzunk létre egy új *Packaget* `screen` néven a projekt mappában, majd ezen belül hozzunk létre egy új *Kotlin Filet* `LoginScreen` néven. Ezen a képernyőn fognak elhelyezkedni a szükséges feliratok, gombok, és beviteli mezők. Ehhez használjuk fel az alábbi kódot

```kotlin
@Composable
fun LoginScreen(
    onSuccess: () -> Unit
) {
    Column (
        modifier = Modifier
            .padding(top = 24.dp)
            .fillMaxSize(),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            modifier = Modifier.padding(16.dp),
            text = "Please enter your credentials"
        )

        var email by remember { mutableStateOf("") }
        var emailError by remember { mutableStateOf(false) }

        OutlinedTextField(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            label = { Text("Email") },
            value = email,
            onValueChange =
            {
                email = it
                emailError = email.isEmpty()
            },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            isError = emailError,
            trailingIcon = {
                if (emailError) {
                    Icon(Icons.Filled.Warning, contentDescription = "Error", tint = Color.Red)
                }
            },
            supportingText = {
                if (emailError) {
                    Text("Please enter your e-mail address", color = Color.Red)
                }
            }

        )


        var password by remember { mutableStateOf("") }
        var passwordError by remember { mutableStateOf(false) }

        OutlinedTextField(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 8.dp, end = 8.dp),
            label = { Text("Password") },
            value = password,
            onValueChange =
            {
                password = it
                passwordError = password.isEmpty()
            },
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
            isError = passwordError,
            trailingIcon = {
                if (passwordError) {
                    Icon(Icons.Filled.Warning, contentDescription = "Error", tint = Color.Red)
                }
            },
            supportingText = {
                if (passwordError) {
                    Text("Please enter your password", color = Color.Red)
                }
            }
        )
        Button(onClick = {
            if (email.isEmpty()) {
                emailError = true
            } else if (password.isEmpty()) {
                passwordError = true
            } else {
                onSuccess()
            }
        }) {
            Text("Login")
        }

    }
}
```

!!!warning "kód értelmezése"
    A laborvezető segítségével beszéljük át, és értelmezzük a kódot!

Hogy ha ezzel a lépéssel is megvagyunk, akkor a `NavGraph` fájlban az errornak el kell tűnnie a szükséges importok után.

Már csak egyetlen lépés van, hogy ezt a képernyőt az emulátoron láthassuk az indítás után. Nyissuk meg a `MainActivity` fájlt, és módosítsuk a következő szerint:


```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            PublicTransportTheme {
                NavGraph()
            }
        }
    }
}
```

!!!example "BEADANDÓ (0.5 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **login képernyő egy input hibával** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod az e-mail mezőbe begépelve**. A képet a megoldásban a repository-ba f2.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

## Lehetőségek listája (1 pont)

A következő képernyőn a felhasználó a különböző járműtípusok közül választhat. Egyelőre csak három szolgáltatás működik a fiktív vállalatunkban: bicikli, buszok illetve vonatok.

<p align="center"> 
<img src="./assets/list.png" width="320">
</p>

Először töltsük le [az alkalmazáshoz képeit tartalmazó tömörített fájlt](./downloads/res.zip), ami tartalmazza az összes képet, amire szükségünk lesz. A tartalmát másoljuk be az `app/src/main/res` mappába (ehhez segít, ha Android Studio-ban bal fent a szokásos Android nézetről a Project nézetre váltunk, esetleg a mappán jobb klikk > Show in Explorer).

Hozzunk ehhez létre egy új *Kotlin Filet* és nevezzük el `ListScreen` néven, majd írjuk bele a következőt:

```kotlin
@Composable
fun ListScreen(
    onPassClick: (s: String) -> Unit
) {
    //TODO
}
```

Menjünk vissza a `NavGraph` file-ba és egészítsük ki a következővel

```kotlin
@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
){

    NavHost(
        navController = navController,
        startDestination = "login"
    ){
        ...
        composable("list"){
            ListScreen(
                onPassClick = {
                    navController.navigate("pass/$it")
                }
            )
        }
    }
}
```

Ezután készítsük el a `ListScreen` felépítését.

```kotlin
@Composable
fun ListScreen(
    onPassClick: (s: String) -> Unit
) {
    Column (
        modifier = Modifier
            .padding(top = 24.dp)
            .fillMaxSize()
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clickable {
                    Log.d("ListScreen", "Bike clicked")
                    onPassClick("Bike")
                },
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
            ) {
                Image(
                    painter = painterResource(id = R.mipmap.bikes),
                    contentDescription = "Bike Button",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.FillBounds
                )
            }
            Text(
                text = "Bike",
                fontSize = 36.sp,
                color = Color.White,
                modifier = Modifier
                    .align(Alignment.Center)
            )
        }
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clickable {
                    Log.d("ListScreen", "Bus clicked")
                    onPassClick("Bus")
                },
        ) {

            Surface(
                modifier = Modifier
                    .fillMaxWidth()
            ) {
                Image(
                    painter = painterResource(id = R.mipmap.bus),
                    contentDescription = "Bus Button",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.FillBounds
                )
            }
            Text(
                text = "Bus",
                fontSize = 36.sp,
                color = Color.White,
                modifier = Modifier
                    .align(Alignment.Center)
            )
        }
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clickable {
                    Log.d("ListScreen", "Train clicked")
                    onPassClick("Train")
                }
            ,
        ) {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
            ) {
                Image(
                    painter = painterResource(id = R.mipmap.trains),
                    contentDescription = "Train Button",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.FillBounds
                )
            }
            Text(
                text = "Train",
                fontSize = 36.sp,
                color = Color.White,
                modifier = Modifier
                    .align(Alignment.Center)
            )
        }
    }
}
```

Vagy az érdeklődők kedvéért az alábbi kódot. Ezzel a kóddal ugyanazt érhetjük el mint az előzővel, csak kevesebbet kell írni, illetve kicsit összetettebb.

```kotlin
@Composable
fun ListScreen(
    onPassClick: (s: String) -> Unit
) {
    Column (
        modifier = Modifier
            .padding(top = 24.dp)
            .fillMaxSize()
    ) {
        val type = mapOf(
            "Bike" to R.mipmap.bikes,
            "Bus" to R.mipmap.bus,
            "Train" to R.mipmap.trains
        )

        for (i in type) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .clickable {
                        Log.d("ListScreen", "${i.key} clicked")
                        onPassClick(i.key)
                    },
            ) {

                Surface(
                    modifier = Modifier
                        .fillMaxWidth()
                ) {
                    Image(
                        painter = painterResource(id = i.value),
                        contentDescription = "$i Button",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.FillBounds
                    )
                }
                Text(
                    text = i.key,
                    fontSize = 36.sp,
                    color = Color.White,
                    modifier = Modifier
                        .align(Alignment.Center)
                )
            }
        }
    }
}
```

Az itt használt `Box`-ról tudjuk, hogy a benne elhelyezett Composable-k egymásra pakolódnak, így könnyen el tudjuk érni azt, hogy egy képen felirat legyen. A `Box`-nak a `modifier` segítségével tudunk kattintás eventet adni neki (`Modifier.clickable{..}`), így könnyen elérhetjük a további navigációt, azonban ez a funkció még elcrasheli az alkalmazást, mert hiányzik a `NavGraph`-ból az elérési út. Ezt a következő feladatban orvosolni fogjuk.

!!!warning "kód értelmezése"
    A laborvezető segítségével beszéljük át, és értelmezzük a kódot!

!!!info "Stringek kiszervezése"
    Nagyobb projekteknél érdemes a Stringeket kiszervezni a `./values/strings.xml` fájlba, így [lokalizálhatjuk](https://developer.android.com/guide/topics/resources/localization) az alkalmazásunkat `erőforrásminősítők` segítségével. Ezt az <kbd>ALT</kbd> + <kbd>ENTER</kbd> billentyűkombináció segítségével tehetjük meg, hogy ha a string-re kattintunk, vagy akár kézileg is megtehetjük a `strings.xml`-ben
    ```xml
    <string name="bike">Bike</string>
    ```

Próbáljuk ki az alkalmazásunkat, a bejelentkezés után az elkészített lista nézetet kell látnunk. Habár a lista elemein való kattintás még nem navigál minket tovább, érdemes a `LogCat` segítségével leellenőrizni a Logolást, ugyanis, ha mindent jól csináltunk, akkor látni kellene az adott járműre való kattintást.


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **jármúvek listája** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f3.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

## Részletes nézet (1 pont)

Miután a felhasználo kiválasztotta a kívánt közlekedési eszközt, néhány további opciót fogunk még felajánlani számára. Ezen a képernyőn fogja kiválasztani a bérleten szereplő dátumokat, illetve a rá vonatkozó kedvezményt, amennyiben van ilyen.

<p align="center"> 
<img src="./assets/details.png" width="320">
</p>

Hozzuk létre az új Screen-t `PassScreen` néven, és készítsük el a felépítését, az alábbi szerint:

```kotlin
@Composable
fun PassScreen(
    onSuccess: (s: String) -> Unit,
    passId: String
) {
    val context = LocalContext.current
    
    val calendar = Calendar.getInstance()
    val year = calendar.get(Calendar.YEAR)
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)

    var startDate by remember { mutableStateOf(String.format(Locale.US, "%d. %02d. %02d", year, month + 1, day)) }
    var endDate by remember { mutableStateOf(String.format(Locale.US, "%d. %02d. %02d", year, month + 1, day)) }
    val currentDate = "$year. ${month + 1}. $day"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp, top = 24.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.Start
    ) {
        Text(
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .padding(top = 16.dp),
            text = "${passId} pass",
            fontSize = 24.sp
        )
        Text(
            modifier = Modifier.padding(top = 16.dp),
            text = "Start date",
            fontSize = 16.sp
        )
        TextButton(
            modifier = Modifier.padding(top = 16.dp),
            onClick = {
            DatePickerDialog(
                context,
                { _, selectedYear, selectedMonth, selectedDay ->
                    startDate = String.format(Locale.US, "%d. %02d. %02d", selectedYear, selectedMonth + 1, selectedDay)
                },
                year, month, day
            ).show()
        }) {
            Text(
                text = if (startDate.isEmpty()) currentDate else startDate,
                fontSize = 16.sp
            )
        }

        Text(
            modifier = Modifier.padding(top = 16.dp),
            text = "End date",
            fontSize = 16.sp
        )

        TextButton(
            modifier = Modifier.padding(top = 16.dp),
            onClick = {
            DatePickerDialog(
                context,
                { _, selectedYear, selectedMonth, selectedDay ->
                    endDate = String.format(Locale.US, "%d. %02d. %02d", selectedYear, selectedMonth + 1, selectedDay)
                },
                year, month, day
            ).show()
        }) {
            Text(
                text = if (endDate.isEmpty()) currentDate else endDate,
                fontSize = 16.sp
            )
        }
        var selectedCategory by remember { mutableStateOf("Full price") }
        
        val categories = listOf("Full price", "Senior", "Public servant")
        Text(
            modifier = Modifier.padding(top = 16.dp),
            text = "Price category",
            fontSize = 16.sp
        )
        Column (
            modifier = Modifier.padding(top = 16.dp)
        ) {
            categories.forEach { category ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .selectable(
                            selected = (category == selectedCategory),
                            onClick = { selectedCategory = category },
                            role = Role.RadioButton
                        )
                        .padding(vertical = 4.dp)
                ) {
                    RadioButton(
                        selected = (category == selectedCategory),
                        onClick = { selectedCategory = category }
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(category)
                }
            }
        }
        Text(
            fontSize = 20.sp,
            text = "Price: 42000",
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .padding(top = 16.dp),
        )
        Button(
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .padding(top = 16.dp),
            onClick = {
                onSuccess("${startDate};$endDate;Senior Bus Pass")
            }){
            Text("Buy")
        }
    }
}
```


!!!info "Értelmezés"
    Az alábbi kódban nagyon sok formázás van, így jelentősen megnehezítheti az értelmezését, ezt a laborvezető segítségével nézzük át, és értelmezzük.

Ezután bővítsük ki a `NavGrap`-unkat a következő szerint, majd beszéjük át a laborvezetővel a kód működését.

```kotlin
@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
){
    NavHost(
        navController = navController,
        startDestination = "login"
    ){
        ...
        composable(
            route = "pass/{id}",
            arguments = listOf(navArgument("id") { type = NavType.StringType })
        ) { backStackEntry ->
            PassScreen(passId = backStackEntry.arguments?.getString("id") ?: "",
                onSuccess = {
                    navController.navigate("ticket/$it")
                }
            )
        }
    }
}
```


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **részletes nézet** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f4.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.



## A bérlet (1 pont)

Az alkalmazás utolsó képernyője már kifejezetten egyszerű lesz, ez maga a bérletet fogja reprezentálni. Itt a bérlet típusát és érvényességi idejét fogjuk megjeleníteni, illetve egy QR kódot, amivel ellenőrizni lehet a bérletet.

<p align="center"> 
<img src="./assets/pass.png" width="320">
</p>


Hozzuk létre a szükséges *Kotlin Filet* szintén a `screen` packageba, `TicketScreen` néven, majd írjuk bele az alábbiakat.

```kotlin
@Composable
fun TicketScreen(
    ticketRange: String
){

    val parts = ticketRange.split(";")

    val startDate = parts[0]
    val endDate = parts[1]
    val category = parts[2]

    Column (
        modifier = Modifier
            .padding(top = 24.dp)
            .fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Text(
            text = category,
            fontSize = 24.sp,
            modifier = Modifier.padding(16.dp)
        )
        Text(
            text = "$startDate - $endDate",
            fontSize = 16.sp,
            modifier = Modifier.padding(16.dp)
        )
        Image(painter = painterResource(id = R.mipmap.qrcode), contentDescription = "Ticket")
    }
}
```

Mivel a `TicketScreen`-nek szüksége van a jegy típúsára, valamint az érvényességi idejére, ezt egy paraméterként kapja meg, majd ezt egy függvényen belül feldolgozzuk, és az alábbiak szerint használjuk fel.

- `yyyy. mm. dd.;yyyy. mm. dd.;price` a felépítése a kapott Stringnek
- Ezt feldaraboljuk a `;` mentén, majd a dátumot string interpoláció segítségével átadjuk a `Text` Composable értékének, a price-t pedig egy másik `Text` Composable-nak

!!!info ""
	 Látható, hogy a Java-val ellentétben a Kotlin támogatja a [string interpolációt](https://kotlinlang.org/docs/reference/basic-types.html#string-templates).

Végül itt is kössük be a `NavGraph`-ba az új képernyőnket az előzőhöz hasonlóan:


```kotlin
@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
){

    NavHost(
        navController = navController,
        startDestination = "login"
    ){
        ...
        composable(
            route = "ticket/{range}",
            arguments = listOf(navArgument("range") { type = NavType.StringType })
        ) { backStackEntry ->
            TicketScreen(ticketRange = backStackEntry.arguments?.getString("range") ?: "")
        }
    }
}
```


!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **bérlet képernyő** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), egy **ahhoz tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f5.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

## Önálló feladat - Hajó bérlet (1 pont)

Vállalatunk terjeszkedésével elindult a hajójáratokat ajánló szolgáltatásunk is. Adjuk hozzá ezt az új bérlet típust az alkalmazásunkhoz!

???info "Segítség"
    A szükséges változtatások nagy része a `ListScreen`-ben lesz. Az eddigi 3 lehetőség mellé fel kell venni egy új `Box`-ot, és az előzőekhez hasonlóan át kell alakítani az új opciót.

!!!example "BEADANDÓ (1 pont)"
	Készíts **két képernyőképet**, amelyen látszik a **jármű választó képernyő** illetve a **hajó bérlet képernyő** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), és az **ezekhez tartozó kódrészlet**, valamint a **neptun kódod a kódban valahol kommentként**. A képeket a megoldásban a repository-ba f6.png és f7.png néven töltsd föl. 

	A képernyőképek szükséges feltételei a pontszám megszerzésének.


## Ismertető feladat (Extra)

!!!note "Ismertető"
    Ezek a feladatok nem szükségesek a labor maximális pont megszerzéséhez, csupán csak ismertető jelleggel vannak a labor anyagában azok számára akik jobban beleásnák magukat a témába :)


### Ismertető feladat - NavGrap-Splash

Korábban ezt a képernyőt a [Splash Screen API](https://developer.android.com/develop/ui/views/launch/splash-screen) segítségével oldottuk meg, azonban többfajta lehetőség is van, ezek közül most a NavGrap segítségével fogunk egyet megnézni.

Ez a képernyő lényegében egy ugyanolyan képernyő mint a többi. Itt első sorban hozzunk létre egy új *Kotlin Filet* a `screen` packagen belül, majd nevezzük el `SplashScreen`-nek, és írjuk bele az alábbi kódot:

```kotlin
@Composable
fun SplashScreen(
    onSuccess: () -> Unit
){
    LaunchedEffect(key1 = true){
        delay(1000)
        onSuccess()
    }
    Column (
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Image(
            modifier = Modifier
                .size(128.dp),
            painter = painterResource(id = R.drawable.ic_transport_foreground),
            contentDescription = "Public Transport",)
    }
}
```

A LaunchedEffect-ről bővebben majd előadáson tanulhattok. Itt szükség volt rá, ugyanis a benne lévő delay függvényt nem lehet csak önmagában kiírni, egy *suspend* függvényen belül, vagy egy *courutinen* belül lehet meghívni. A delay függvény felel azért, hogy mennyi ideig legyen a képernyőn a SplashScreen. Jelen esetben ez 1 másodperc (1000 milisec), majd ezután meghívódik az onSucces lambda, ami átnavigál minket a LoginScreen-re.


Módosítsuk a `NavGraph`-unkat a következő szerint:

```kotlin
NavHost(
    navController = navController,
    startDestination = "splash"
){
    composable("splash"){
        SplashScreen(
            onSuccess = {
                navController.navigate("login"){
                    popUpTo("splash"){ inclusive = true }
                    launchSingleTop = true
                }
            }
        )
    }
    ...
}
```

A `SplashScreen` képernyő testreszabásával a labor keretein belül nem fogunk foglalkozni, ez teljesen egyénre szabható. 

Az újonnan hozzáadott `composable` elem a `NavGraph`-ban a következő képpen épül fel:

- Szintén kapott egy elérési *routet*
- Valamint megkapta a kívánt képernyőt a függvény törzsében
- Ennek van egy *onSuccess* lambda paramétere, amibe beletesszük a következő képernyőre való navigálást
- Ezen belül a `popUpTo` segítségével kiszedjük a SplashScreen-t, hogy visszanavigálás esetén, ne dobja be ezt

Majd ezután a `Manifest` fájl személyre szabható, hogy milyen témát jelenítsen meg.


### Ismertető feladat - Screen File

Ez a fájl az alábbi kódot fogja tartalmazni:

```kotlin
sealed class Screen(val route: String){
    object Login: Screen("login")
    object List: Screen("list")
    object Pass: Screen("pass/{id}"){
        fun passId(id: String) = "pass/$id"
    }
    object Ticket: Screen("ticket/{range}"){
        fun ticketRange(range: String) = "ticket/$range"
    }
}
```

Valamint a `NavGraph` `route` paraméterének nem egy nyers Stringet adunk át, hanem ennek az osztálynak egy Object-jét a következő képpen:

```kotlin
@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
){

    NavHost(
        navController = navController,
        startDestination = Screen.Login.route
    ){
        composable(Screen.Login.route){
            LoginScreen(
                onSuccess = {
                    navController.navigate(Screen.List.route)
                }
            )
        }
        composable(Screen.List.route){
            ListScreen(
                onPassClick = {
                    navController.navigate(Screen.Pass.passId(it))
                }
            )
        }
        composable(
            route = Screen.Pass.route,
            ...
        ) { backStackEntry ->
            PassScreen(passId = backStackEntry.arguments?.getString("id") ?: "",
                onSuccess = {
                    navController.navigate(Screen.Ticket.ticketRange(it))
                }
            )
        }
        composable(
            route = Screen.Ticket.route,
            ...
        ) { 
            ...
        }

    }
}
```

Jól látható, hogy a *Sealed Class* segítségével könnyebben módosítható az egyes elérési utak címe. Mind a két megoldás működőképes, viszont ez utóbbi kicsit elegánsabb nagyobb projekteknél.



## iMSc feladat


Korábban a részletes nézetben egy fix árat írtunk ki a képernyőre. Írjuk meg a bérlet árát kiszámoló logikát, és ahogy a felhasználó változtatja a bérlet paramétereit, frissítsük a megjelenített árat.

Az árazás a következő módon működjön:

| Közlekedési eszköz | Bérlet ára naponta |
| ------------------ | ------------------ |
| Bicikli            | 700                |
| Busz               | 1000               |
| Vonat              | 1500               |
| Hajó               | 2500               |

Ebből még az alábbi kedvezményeket adjuk:

| Árkategória    | Kedvezmény mértéke |
| -------------- | ------------------ |
| Teljes árú     | 0%                 |
| Nyugdíjas      | 90%                |
| Közalkalmazott | 50%                |

!!!tip "Tipp"
	A számolásokhoz és az eseménykezeléshez a [`Calendar`][calendar] osztályt, a valamint a Calendar.set függvényt érdemes használni.

	[calendar]: https://developer.android.com/reference/java/util/Calendar.html


???tip "Tipp"
    Érdemes két függvényt írni, a számoláshoz:
    
    - Az egyik függvény egy különbség számító, ami két dátum között eltelt napokat számol
    - A másik függvény pedig ami a napok, és a kategória alapján kiszámolja az árat

### Különböző bérlet napi árak (1 IMSc pont)

!!!example "BEADANDÓ (1 IMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik egy **több napos bérlet részletes nézete az árral** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), **a bérletárakkal kapcsolatos kóddal**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f8.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

### Százalékos kedvezmények ( 1 IMSc pont)

!!!example "BEADANDÓ (1 IMSc pont)"
	Készíts egy **képernyőképet**, amelyen látszik egy **több napos kedvezményes bérlet részletes nézete az árral** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), **a bérletkedvezményekkel kapcsolatos kóddal**, valamint a **neptun kódod a kódban valahol kommentként**. A képet a megoldásban a repository-ba f9.png néven töltsd föl. 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.
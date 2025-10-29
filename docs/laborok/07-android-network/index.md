# Labor 07 - Retrofit - Időjárás alkalmazás

## Bevezető

A labor során egy időjárás információkat megjelenítő alkalmazás elkészítése a feladat. A korábban látott UI elemek használata mellett láthatunk majd példát hálózati kommunkáció hatékony megvalósítására is a [`Retrofit`](https://square.github.io/retrofit/) könyvtár felhasználásával.

Az alkalmazás városok listáját jeleníti meg egy [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists)-ban, a kiválasztott város időjárás adatait pedig az [OpenWeatherMap](https://openweathermap.org/) *REST API*-jának segítségével kérdezi le.  Új város hozzáadására egy  [`FloatingActionButton`](https://developer.android.com/guide/topics/ui/floating-action-button) megnyomásával van lehetőség. 

!!!info "REST"
    REST = [Representational State Transfer](https://en.wikipedia.org/wiki/Representational_state_transfer)

Felhasznált technológiák: 

- [`Activity`](https://developer.android.com/guide/components/activities/intro-activities)
- [`Scaffold`](https://developer.android.com/develop/ui/compose/components/scaffold)
- [`AppBar`](https://developer.android.com/develop/ui/compose/components/app-bars)
- [`FloatingActionButton`](https://developer.android.com/develop/ui/compose/components/fab)
- [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists)
- [`Dialog`](https://developer.android.com/develop/ui/compose/components/dialog)
- [`SwipeToDismissBox`](https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary#SwipeToDismissBox(androidx.compose.material3.SwipeToDismissBoxState,kotlin.Function1,androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.Boolean,kotlin.Boolean,kotlin.Function1))
- [`Navigation3`](https://developer.android.com/jetpack/androidx/releases/navigation3)
- [`ViewModel`](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [`Repository Pattern`](https://developer.android.com/codelabs/basic-android-kotlin-compose-add-repository)
- [`Retrofit`](https://square.github.io/retrofit/)
- [`Moshi`](https://github.com/square/moshi)
- [`Coil`](https://github.com/coil-kt/coil)
- [`Room`](https://developer.android.com/training/data-storage/room)


## Az alkalmazás specifikációja

Az alkalmazás egy `Activity`-ből áll. 

Az alkalmazás indulásakor megjelenő `CityListScreen` a felhasználó által felvett városok listáját jeleníti meg. A városokat balra elhúzva az adott város törlődik a listából. Új várost a nézet jobb alsó sarkában található *FloatingActionButton* megnyomásával lehet felvenni.

Egy városra való kattintás hatására egy új *Composable* képernyőt hozunk előtérbe az adott város időjárás adataival. A rövid jellemzés mellett egy akutális ikon és a  városban mért átlagos, minimum és maximum hőmérséklet, a légnyomás és a páratartalom értéke látható.

<p align="center">
<img src="./assets/list.png" width="240">
<img src="./assets/dialog.png" width="240">
<img src="./assets/weather.png" width="240">
</p>


## Laborfeladatok

A labor során az alábbi feladatokat a laborvezető segítségével, illetve a jelölt feladatokat önállóan kell megvalósítani.

1. MVI architektúra megvalósítása: 1 pont
1. Időjárás nézet létrehozása : 1 pont
1. Hálózati kommunikáció megvalósítása: 1 pont
1. Önálló feladat: város listából törlés megvalósítása: 1 pont
1. Önálló feladat: perzisztens mentés megvalósítása: 1 pont

A labor során egy komplex időjárás alkalmazás készül el. A labor szűkös időkerete miatt szükség lesz nagyobb kódblokkok másolására, azonban minden esetben figyeljünk a laborvezető magyarázatára, hogy a kódrészek érthetőek legyenek. A cél a bemutatott kódok megértése és a felhasznált libraryk használatának elsajátítása.


## Előkészületek

A feladatok megoldása során ne felejtsd el követni a [feladat beadás folyamatát](../../tudnivalok/github/GitHub.md).

### Git repository létrehozása és letöltése

1. Moodle-ben keresd meg a laborhoz tartozó meghívó URL-jét és annak segítségével hozd létre a saját repository-dat.

1. Várd meg, míg elkészül a repository, majd checkout-old ki.

    !!! tip ""
        Egyetemi laborokban, ha a checkout során nem kér a rendszer felhasználónevet és jelszót, és nem sikerül a checkout, akkor valószínűleg a gépen korábban megjegyzett felhasználónévvel próbálkozott a rendszer. Először töröld ki a mentett belépési adatokat (lásd [itt](../../tudnivalok/github/GitHub-credentials.md)), és próbáld újra.

1. Hozz létre egy új ágat `megoldas` néven, és ezen az ágon dolgozz.

1. A `neptun.txt` fájlba írd bele a Neptun kódodat. A fájlban semmi más ne szerepeljen, csak egyetlen sorban a Neptun kód 6 karaktere.


### Projekt megnyitása

Ezen a laboron nem új projektet fogunk létrehozni, hanem egy már létezőből indulunk ki, amiben már megtalálhatóak az elmúlt laborokon tanult alapok. A projekt megtalálható a kicheckoutolt repositoryban *WeatherInfo* néven. Nyissuk meg a projektet és a laborvezetővel nézzük át a felépítését!

#### Függéségek

A projektben szerepel a labor során szükséges összes függőség, ezeket a későbbiekben már nem kell újra hozzáadni, de azért az adott résznél szerepeltetni fogjuk őket.


`libs.versions.toml`:

```toml
[versions]
agp = "8.12.3"
kotlin = "2.2.20"
coreKtx = "1.17.0"
junit = "4.13.2"
junitVersion = "1.3.0"
espressoCore = "3.7.0"
lifecycleRuntimeKtx = "2.9.4"
activityCompose = "1.11.0"
composeBom = "2025.10.00"


viewModel = "2.9.4"
nav3Core = "1.0.0-alpha11"
kotlinSerialization = "2.2.20"
kotlinxSerializationCore = "1.9.0"
coilCompose = "2.7.0"
moshi = "1.15.2"
retrofit = "3.0.0"
ksp = "2.2.10-2.0.2"
room = "2.8.2"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }


androidx-material-icons-extended = { group = "androidx.compose.material", name="material-icons-extended" }
androidx-lifecycle-viewmodel-compose = {group = "androidx.lifecycle", name="lifecycle-viewmodel-compose", version.ref = "viewModel" }
androidx-navigation3-runtime = { module = "androidx.navigation3:navigation3-runtime", version.ref = "nav3Core" }
androidx-navigation3-ui = { module = "androidx.navigation3:navigation3-ui", version.ref = "nav3Core" }
kotlinx-serialization-core = { module = "org.jetbrains.kotlinx:kotlinx-serialization-core", version.ref = "kotlinxSerializationCore" }
coil-compose = { group = "io.coil-kt", name="coil-compose", version.ref = "coilCompose" }
squareup-moshi = { group = "com.squareup.moshi", name = "moshi-kotlin", version.ref = "moshi" }
converter-moshi = { group = "com.squareup.retrofit2", name = "converter-moshi", version.ref = "retrofit" }
retrofit = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
androidx-room-runtime = {group = "androidx.room", name="room-runtime", version.ref= "room" }
androidx-room-compiler = {group = "androidx.room", name="room-compiler", version.ref= "room" }
androidx-room-ktx = {group = "androidx.room", name="room-ktx", version.ref= "room" }


[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }

jetbrains-kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlinSerialization"}
google-devtools-ksp = { id = "com.google.devtools.ksp", version.ref="ksp"}
```


Projekt szintű `build.gradle.kts`:

```kts
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false

    alias(libs.plugins.jetbrains.kotlin.serialization) apply false
    alias(libs.plugins.google.devtools.ksp) apply false
}
```

Modul szintű `build.gradle.kts`:

```kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)

    alias(libs.plugins.jetbrains.kotlin.serialization)
    alias(libs.plugins.google.devtools.ksp)

}

android {
    namespace = "hu.bme.aut.android.weatherinfo"
    compileSdk = 36

    defaultConfig {
        applicationId = "hu.bme.aut.android.weatherinfo"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)

    implementation(libs.androidx.material.icons.extended)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.navigation3.ui)
    implementation(libs.androidx.navigation3.runtime)
    implementation(libs.kotlinx.serialization.core)
    implementation(libs.retrofit)
    implementation(libs.squareup.moshi)
    implementation(libs.converter.moshi)
    implementation(libs.coil.compose)
    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)

}
```

!!!info "Retrofit"
    A `Retrofit` a fejlesztő által leírt egyszerű, megfelelően annotált interfészek alapján kódgenerálással állít elő HTTP hivásokat lebonyolító implementációt. Kezeli az URL-ben inline módon adott paramétereket, az URL queryket, stb. Támogatja a legnépszerűbb szerializáló/deszerializáló megoldásokat is (pl.: [`Gson`](https://github.com/google/gson), [`Moshi`](https://github.com/square/moshi), [`Simple XML`](https://sourceforge.net/projects/simple/), stb.), amikkel Java/Kotlin objektumok, és JSON vagy XML formátumú adatok közötti kétirányú átalakítás valósítható meg. A laboron ezek közül a `Moshi`-t fogjuk használni a JSON-ban érkező időjárás adatok konvertálására.

!!!info "Coil"
    A `Coil`  egy hatékony képbetöltést és cache-elést megvalósító library Androidra. Egyszerű *interface*-e és hatékonysága miatt használjuk.


#### Erőforrások

A projektben szerepelnek az alkalmazás ikonjai, a szükséges grafikus erőforrások és a szöveges erőforrások:

`strings.xml`:

```xml
<resources>
    <string name="app_name">WeatherInfo</string>
    <string name="button_label_ok">OK</string>
    <string name="button_label_cancel">Cancel</string>
    <string name="some_error_message">Something went wrong.</string>
    <string name="label_add_city">Add city</string>
    <string name="label_weather_in">Weather in %1$s</string>
    <string name="label_temperature">Temperature</string>
    <string name="label_min_temperature">Min. temperature</string>
    <string name="label_max_temperature">Max. temperature</string>
    <string name="label_pressure">Pressure</string>
    <string name="label_humidity">Humidity</string>
    <string name="label_city">City</string>
</resources>

```

#### A modell 

Az alkalmazásunk a fő képernyőjén egy város listát fog megjeleníteni. Ez fontos lesz mind a felhasználói felület, mind az adattárolás szempontjából, így a `domain` *package*-en belül a `model` *package*-be kerül.

`City.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.domain.model

class City(
    var id: Int,
    var name: String
)
```

A tételünk tartalmaz egy ID-t, valamint egy nevet a városnak.


#### A repository

Ugyan jelenleg csak memóriában tároljuk a városlistánkat, de a későbbi bővíthetőség érdekében megtartjuk a korábban tanult *repository* mintát a `data.local.repository` *package*-ben:

`ICityRepository.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.data.local.repository

import hu.bme.aut.android.weatherinfo.domain.model.City
import kotlinx.coroutines.flow.Flow

interface ICityRepository {

    suspend fun getAllCities(): Flow<List<City>>
    suspend fun addCityByName(cityName: String)
}
```

`MemoryCityRepository.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.data.local.repository

import androidx.compose.runtime.mutableStateListOf
import hu.bme.aut.android.weatherinfo.domain.model.City
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class MemoryCityRepository : ICityRepository {
    private var nextId=3

    private var cities = mutableStateListOf(
        City(id = 0, "Budapest"),
        City(id = 1, "London"),
        City(id = 2, "Berlin")
    )

    override suspend fun getAllCities(): Flow<List<City>> = flow {
        emit(cities)
    }

    override suspend fun addCityByName(cityName: String) {
        cities.add(City(id = nextId++, name = cityName))
    }

}
```

Látható, hogy jelenleg egy hármas listával dolgozunk, és minden újabb város inkrementálisan kap ID-t.

A *repository* elkészítése után példányosítsuk is azt az *application* osztályunkban a `hu.bme.aut.android.weatherinfo` *package*-ben.

`WeatherInfo.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo

import android.app.Application
import hu.bme.aut.android.weatherinfo.data.local.repository.ICityRepository
import hu.bme.aut.android.weatherinfo.data.local.repository.MemoryCityRepository

class WeatherInfoApplication : Application() {
    companion object {

        lateinit var cityRepository: ICityRepository
    }

    override fun onCreate() {
        super.onCreate()

        cityRepository = MemoryCityRepository()
    }
}
```

Majd pedig az `AndroidManifest.xml`-ben állítsuk be az *application* osztályunk használatát.

`AndroidManifest.xml`:


```xml
...
<application
        android:name=".WeatherInfoApplication"
...
```


#### A felhasználói felület

A városok megjelenítése mellett lehetővé kell tennünk új város felvételét is. Ezt egy egyszerű általános dialógussal fogjuk megtenni, amibe a felhasználó egy szöveget írhat be. Ez, mivel nem felület specifikus elem, a `ui.common` *package*-be kerül:

`StringInputDialog.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.common

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationCity
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import hu.bme.aut.android.weatherinfo.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StringInputDialog(
    modifier: Modifier = Modifier,
    title: String,
    label: String,
    onDismiss: () -> Unit,
    onConfirm: (String) -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Card(shape = RoundedCornerShape(16.dp)) {
            Column(

                modifier = modifier
                    .background(MaterialTheme.colorScheme.background)
                    .padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {

                var input by remember { mutableStateOf("") }
                var isInputError by remember { mutableStateOf(input.isEmpty()) }

                Icon(
                    imageVector = Icons.Default.LocationCity,
                    contentDescription = null
                )
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 24.sp
                )

                Spacer(modifier = Modifier.height(16.dp))

                OutlinedTextField(
                    shape = RoundedCornerShape(8.dp),
                    value = input,
                    onValueChange = {
                        input = it
                        isInputError = it.isEmpty()
                    },
                    maxLines = 1,
                    isError = isInputError,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                    label = { Text(text = label) }
                )

                Spacer(modifier = Modifier.height(16.dp))

                Row(
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        shape = RoundedCornerShape(8.dp),
                        modifier = modifier
                            .weight(1f)
                            .padding(8.dp)
                    ) {
                        Text(stringResource(id = R.string.button_label_cancel))
                    }
                    Button(
                        onClick = {
                            if (!isInputError) {
                                onConfirm(input)
                                onDismiss()
                            }
                        },
                        shape = RoundedCornerShape(8.dp),
                        modifier = modifier
                            .weight(1f)
                            .padding(8.dp)
                    ) {
                        Text(stringResource(id = R.string.button_label_ok))
                    }
                }
            }
        }
    }
}

@Composable
@Preview
fun StringInputDialogPreview() {
    StringInputDialog(
        title = "Add City",
        label = "City name",
        onDismiss = {},
        onConfirm = {}
    )
}
```

Ennek a függvénynek két lambda paramétere van: az `onDismiss` fog felelni azért hogy a dialógus ablakunkat el tudjuk tüntetni, az `onConfirm` pedig az új város hozzáadását teszi lehetővé. Ezeket a lambda paramétereket továbbadjuk paraméterként a többi függvénynek a következő képpen:

- `onDismiss` - Ezt a paramétert mind a két gomb meg kell hogy kapja, ugyanis ha hozzáadtunk egy új várost azt szeretnénk hogy eltűnjön az ablak, illetve ha meggondolnánk magunkat és nem szeretnénk új várost felvenni akkor is el kell tüntetni az ablakot.
- `onConfirm` - Ezt csak a pozitív gombra fogjuk rátenni, egy *string* paraméterrel, ami pedig a beviteli mező szerint lesz változtatható.

Az alkalmazásunk felhasználói felülete jelenleg elég egyszerű. Egy *screen*-t tartalmaz, amin található egy `TopBar`, a lista az elemekről és egy `FloatingActionButton`. A gomb megnyomásának hatására megnyílik az új elem felvételére szolgáló `StringInputDialog` dialógus ablak. A `CityListScreen` és a hozzá tartozó a  `CityListViewModel` a `hu.bme.aut.android.weatherinfo.ui.screen.citylist` *package*-ben található, az építőelemei pedig ezen belül egy `components` *package*-ben:

`CityCard.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.citylist.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.ListItemDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.SwipeToDismissBox
import androidx.compose.material3.SwipeToDismissBoxValue
import androidx.compose.material3.Text
import androidx.compose.material3.rememberSwipeToDismissBoxState
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import hu.bme.aut.android.weatherinfo.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CityCard(
    city: String,
    onCityClick: (String) -> Unit,
    onDelete: (String) -> Unit
) {

    ListItem(
        colors = ListItemDefaults.colors(containerColor = MaterialTheme.colorScheme.primaryContainer),
        headlineContent = {
            Text(
                text = city,
                fontSize = 24.sp
            )

        },
        leadingContent = {
            Icon(
                modifier = Modifier
                    .size(64.dp),
                painter = painterResource(id = R.drawable.ic_placeholder),
                contentDescription = ""
            )
        },
        modifier = Modifier.clickable(onClick = {
            onCityClick(
                city
            )
        }
        )
    )
}

@Composable
@Preview
fun CityCardPreview() {
    CityCard(city = "Budapest", onCityClick = {}, onDelete = {})
}
```

Itt látható, hogy a város nevén kívül átveszünk két eseménykezelőt: egyet a városra kattintáshoz, egyet pedig a törléshez. A megjelenítéshez most nem készítettünk saját komplex elrendezést, inkább a beépített `ListItem` *composable*-t használjuk. A nekünk kellő funkcionalitást, hogy kiírunk egy szöveget, és felhelyezünk egy képet, könnyen megtehetjük a *headlineContent* és a *leadingContent* *property*-kkel.

Most, hogy megvagyunk a komponenseinkkel, jöhet a `CityListViewModel`:

`CityListViewModel.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.citylist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import hu.bme.aut.android.weatherinfo.WeatherInfoApplication
import hu.bme.aut.android.weatherinfo.data.local.repository.ICityRepository
import hu.bme.aut.android.weatherinfo.domain.model.City
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class CityListViewModel(
    private val cityRepository: ICityRepository
) : ViewModel() {

    private val _list = MutableStateFlow<List<City>>(listOf())
    val cityList = _list.asStateFlow()

    init {
        getAllCities()
    }

    private fun getAllCities() {
        viewModelScope.launch {
            cityRepository.getAllCities().collectLatest {
                _list.tryEmit(it)
            }
        }
    }

    fun addCity(city: String) {
        viewModelScope.launch {
            try {
                cityRepository.addCityByName(city)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                CityListViewModel(
                    cityRepository = WeatherInfoApplication.cityRepository
                )
            }
        }
    }
}
```

Ezek után pedig a már összeállíthatjuk a `CityListScreen`-t:

`CityListScreen.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.citylist

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.LargeFloatingActionButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import hu.bme.aut.android.weatherinfo.R
import hu.bme.aut.android.weatherinfo.ui.common.StringInputDialog
import hu.bme.aut.android.weatherinfo.ui.screen.citylist.components.CityCard

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CityListScreen(
    modifier: Modifier = Modifier,
    onCityClick: (String) -> Unit,
    viewModel: CityListViewModel = viewModel(factory = CityListViewModel.Factory)
) {

    val list = viewModel.cityList.collectAsStateWithLifecycle().value

    var isAddCityDialogOpen by remember { mutableStateOf(false) }

    Scaffold(
        modifier = modifier,
        topBar = {
            TopAppBar(
                title = { Text(text = stringResource(id = R.string.app_name)) },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        },
        floatingActionButton = {
            LargeFloatingActionButton(
                onClick = {
                    isAddCityDialogOpen = true
                },
                containerColor = MaterialTheme.colorScheme.primary
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null
                )
            }
        }
    ) { innerPadding ->
        LazyColumn(
            modifier = modifier
                .padding(innerPadding)
                .padding(8.dp)
        ) {
            items(items = list, key = { item -> item.id }) { city ->
                CityCard(
                    city = city.name,
                    onCityClick = onCityClick,
                    onDelete = { /*TODO remove city*/ }
                )
                if (list.size - 1 > list.indexOf(city)) {
                    Spacer(modifier = Modifier.height(8.dp))
                }
            }
        }


        if (isAddCityDialogOpen) {

            StringInputDialog(
                onDismiss = { isAddCityDialogOpen = false },
                onConfirm = { cityList ->
                    viewModel.addCity(cityList)
                    isAddCityDialogOpen = false
                },
                title = stringResource(id = R.string.label_add_city),
                label = stringResource(id = R.string.label_city)
            )
        }
    }
}

@Composable
@Preview
fun CityListScreenPreview() {
    CityListScreen(onCityClick = {})
}
```

#### Navigáció

Ugyan most még csak egy képernyőnk van, de a projektben már elő van készítve a navigáció a korábbi laborokon tanultak szerint:

`Screen.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.navigation

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

sealed interface Screen : NavKey {
    @Serializable
    data object CityListScreenDestination : Screen
}
```

`AppNavigation.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import hu.bme.aut.android.weatherinfo.ui.screen.citylist.CityListScreen

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = rememberNavBackStack(Screen.CityListScreenDestination)

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = entryProvider {

            entry<Screen.CityListScreenDestination> {
                CityListScreen(
                    modifier = modifier,
                    onCityClick = {}
                )
            }


        }
    )
}
```

Most már csak annyi dolgunk van, hogy az `AppNavigation`-t megjelenítsük a `MainActivity`-n:

`MainActivity.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import hu.bme.aut.android.weatherinfo.ui.navigation.AppNavigation
import hu.bme.aut.android.weatherinfo.ui.theme.WeatherInfoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WeatherInfoTheme {
                AppNavigation(modifier = Modifier.safeDrawingPadding())
            }
        }
    }
}
```

Próbáljuk ki az alkalmazást!

A listánk már megjelenik, és akár bővíteni is tudjuk.


### Engedélyek felvétele
Az alkalmazásban szükségünk lesz internet elérésre. Vegyük fel az `AndroidManifest.xml` állományban az *Internet permission*-t az `application` tagen *kívülre*:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```


!!!info "Engedélyek"
    Androidon API 23-tól (6.0, Marshmallow) az engedélyek két csoportba lettek osztva. A *normal* csoportba tartozó engedélyeket elég felvenni az `AndroidManifest.xml` fájlba az előbb látott módon és az alkalmazás automatikusan megkapja őket. A *dangerous* csoportba tartozó engedélyek esetén ez már nem elég, futás időben explicit módon el kell kérni őket a felhasználótól, aki akármikor meg is tagadhatja az alkalmazástól a kért engedélyt. Az engedélyek kezeléséről bővebben a [developer.android.com](https://developer.android.com/guide/topics/permissions/overview) oldalon lehet tájékozódni.


### OpenWeatherMap API kulcs

Regisztráljunk saját felhasználót az [OpenWeatherMap](https://openweathermap.org/) oldalon, és hozzunk létre egy API kulcsot, aminek a segítségével használhatjuk majd a szolgáltatást az alkalmazásunkban! 

1. Kattintsunk a *Sign in* majd a *Create an account* gombra.
1. Töltsük ki a regisztrációs formot
1. A *Company* mező értéke legyen "BME", a *Purpose* értéke legyen "Education/Science"
1. Sikeres regisztráció után az *API keys* tabon található az alapértelmezettként létrehozott API kulcs.

A kapott API kulcsra később szükségünk lesz az időjárás adatokat lekérő API hívásnál.


## MVI architektúra (1 pont)

Az eddigi laborokon (és a jelen projektben is) a UI rétegben az *MVVM* architektúrát alkalmaztuk. Vagyis egy *ViewModel* tartalmazta a megjelenítendő adatainkat, listánkat. Most azonban, mivel az adataink távoli forrásból fognak jönni, és abban sem lehetünk biztosak, hogy rendben megérkeznek, érdemes lehet az adatok és a felület állapotait külön kezelni. Ezért át fogunk térni az *MVI* mintára. Itt a felület állapotát egy külön osztályban, a `CityListScreenState`-ben fogjuk tárolni, és a releváns adatokat ebből tudja majd kinyerni a felület.

### Város lista állapot


#### A ViewModel

Hozzunk tehát létre egy új *package*-et `state` néven a `hu.bme.aut.android.weatherinfo.ui.screen.citylist`-en belül, majd helyezzük is el benne a `CityListScreenState`-et. Ezt is a már ismert *sealed class*-ként fogjuk megvalósítani:

`CityListScreenState.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.citylist.state

import hu.bme.aut.android.weatherinfo.domain.model.City


sealed class CityListScreenState {
    data object Loading : CityListScreenState()
    data class Error(val error: Throwable) : CityListScreenState()
    data class Result(val cityList: List<City>) : CityListScreenState()
}
```

Itt látható, hogy három különböző lehetséges állapotra számítunk:

- *Loading*: az adatok még töltés alatt.
- *Error*: hiba történt az adatok betöltésekor
- *Result*: megvan az eredmény, a tartalmazott listából kiolvasható.

Ezek után a `CityListViewModel` a következőképpen alakul át:

`CityListViewModel.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.citylist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import hu.bme.aut.android.weatherinfo.WeatherInfoApplication
import hu.bme.aut.android.weatherinfo.domain.model.City
import hu.bme.aut.android.weatherinfo.data.local.repository.ICityRepository
import hu.bme.aut.android.weatherinfo.ui.screen.citylist.state.CityListScreenState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class CityListViewModel(
    private val cityRepository: ICityRepository
) : ViewModel() {

    private val _state = MutableStateFlow<CityListScreenState>(CityListScreenState.Loading)
    val state = _state.asStateFlow()

    init {
        getAllCities()
    }

    private fun getAllCities() {
        viewModelScope.launch {
            _state.value = CityListScreenState.Loading
            try {
                cityRepository.getAllCities().collectLatest {
                    _state.tryEmit(CityListScreenState.Result(it))
                }
            } catch (e: Exception) {
                _state.value = CityListScreenState.Error(e)
            }


        }
    }

	...
}
```

Itt tehát már nem a város listát, hanem a `CityListScreenState`-et tároljuk állapotként, és ezt tesszük elérhetővé a `CityListScreen` számára. Az adatok betöltésénél pedig először *Loading*-ra állítjuk az állapotot, majd az eredménytől függően vagy *Result* vagy *Error* állapotba haladunk tovább.

#### Screen

Ezek után a `CityListScreen` így alakul:

```kotlin
fun CityListScreen(
    modifier: Modifier = Modifier,
    onCityClick: (String) -> Unit,
    viewModel: CityListViewModel = viewModel(factory = CityListViewModel.Factory)
) {

    val state = viewModel.state.collectAsStateWithLifecycle().value

    var isAddCityDialogOpen by remember { mutableStateOf(false) }

    Scaffold(
        ...
    ) { innerPadding ->
        when (state) {
            is CityListScreenState.Loading -> CircularProgressIndicator()
            is CityListScreenState.Error -> {
                Text(text = state.error.toString())
            }

            is CityListScreenState.Result -> {
                LazyColumn(
                    modifier = modifier
                        .padding(innerPadding)
                        .padding(8.dp)
                ) {
                    items(items = state.cityList, key = { item -> item.id }) { city ->
                        CityCard(
                            city = city.name,
                            onCityClick = onCityClick,
                            onDelete = { /*TODO remove city*/ }
                        )
                        if (state.cityList.size - 1 > state.cityList.indexOf(city)) {
                            Spacer(modifier = Modifier.height(8.dp))
                        }
                    }
                }
            }
        }

		...
	}
}
```

Figyeljük meg, hogy a felületen hogyan kezeljük le az egyes állapotokat!

### Események

Az *MVI* architektúra másik sarokpontja, az állapot tárolása mellett, az, hogy a *Screen* -ről a *ViewModel* felé nem egyszerű függvényhívások, hanem interakciók/események érkeznek. Ezt a mostani felületen (a teljesség igénye nélkül) az új város hozzáadásánál és az egyes városok törlésénél fogjuk bevezetni. Vegyük fel először a hozzáadás eseményt egy külön osztályba a `hu.bme.aut.android.weatherinfo.ui.screen.citylist.event` *package*-be:

`CityListScreenEvent.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.citylist.event

sealed class CityListScreenEvent {
    data class CityCreated(val city: String) : CityListScreenEvent()
}
```

Látható, hogy az eseménnyel a várost is átadjuk paraméterként.

Ezek után az események lekezelését a `CityListViewModel`-ben végezzük el:

`CityListViewModel.kt`:

```kotlin
class CityListViewModel(
    private val cityRepository: ICityRepository
) : ViewModel() {

    ...

    fun onEvent(event: CityListScreenEvent) {
        when (event) {
            is CityListScreenEvent.CityCreated ->
                addCity(event.city)
        }
    }

	...
}
```

Ezek után a `CityListViewModel` `addCity` függvényét priváttá is tehetjük.

Így természetesen meg kell változtatnunk a `CityListScreen` beli hívást is:

```kotlin
StringInputDialog(
    onDismiss = { isAddCityDialogOpen = false },
    onConfirm = { city ->
        viewModel.onEvent(CityListScreenEvent.CityCreated(city))
        isAddCityDialogOpen = false
    },
    title = stringResource(id = R.string.label_add_city),
    label = stringResource(id = R.string.label_city)
)
```

Láthatjuk, hogy ezzel a lépéssel architekturálisan még jobban szétválasztottuk a *Screen*-t és a *ViewModel*-t.

Próbáljuk ki az alkalmazást!

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **városnevek listája egy újonnan hozzáadott várossal amelynek a neve a NEPTUN kódod** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), a **CityListViewModel** kódja, valamint a **neptun kódod a kódban valahol kommentként**! A képet a megoldásban a repository-ba f1.png néven töltsd föl!

	A képernyőkép szükséges feltétele a pontszám megszerzésének.


## Az időjárás nézet (1 pont)

### Az architektúra kialakítása

Az adataink áramlása hasonló lesz a már korábban látottakhoz, (*repository* -> *viewmodel(state)* -> *screen*) szóval készítsük is el ezeket.

#### Modell osztályok

Az [OpenWeatherMap API](https://openweathermap.org/current) a kéréseinkre válaszként egy JSON objektumban fogja visszaadni az aktuális időjárást. 

!!!info "API hívás (az {appID} lecserélendő a sajátra)"
	https://api.openweathermap.org/data/2.5/weather?q=Budapest&units=metric&appid={appId}

???info "Api válasz"
	```json
	{
		"coord": {
			"lon":19.0399,
			"lat":47.498
		},
		"weather": [
			{
				"id":741,
				"main":"Fog",
				"description":"fog",
				"icon":"50n"
			}
		],
		"base":"stations",
		"main": {
				"temp":9.98,
				"feels_like":9.98,
				"temp_min":8.93,
				"temp_max":10.71,
				"pressure":1013,
				"humidity":96,
				"sea_level":1013,
				"grnd_level":991
		},
		"visibility":8000,
		"wind": {
			"speed":1.03,
			"deg":0
		},
		"clouds": {
			"all":43
		},
		"dt":1728250809,
		"sys": {
			"type":2,
			"id":2009313,
			"country":"HU",
			"sunrise":1728190192,
			"sunset":1728231218},
			"timezone":7200,
			"id":3054643,
			"name":"Budapest",
		"cod":200
	}
	```

Ahhoz, hogy ebből általunk is használható objektumok legyenek, szükségünk lesz a modell osztály(ok)ra, illetve a `Moshi` könyvtárra, ami a konverziót végzi. Ebben a fázisban először a modell osztályokat készítsük el. Mint látható a kapott *JSON* elég bonyolult, és sok al csomópontot tartalmaz. Szerencsére az osztályainkat nem kell kézzel a *JSON*-ből kisilabizálni. Egyrészt a legtöbb *API*-nál kiterjedt leírást kapunk a modellről, másrészt számos konverter létezik a *JSON* -> *Kotlin class* konverzióra. Mi most egy Android Studio Plugin segítségét fogjuk kérni.

Keressük meg az Android Studio beállításai között a *Plugins*-t, ott pedig a *Marketplace* keresőbe írjuk be, hogy *JSON To Kotlin Class*, és telepítsük a megtalált *plugint*.

<p align="center">
<img src="./assets/plugin.png" width="720">
</p>

Ha ez megvan, hozzuk létre a modell osztályok *package*-ét a `hu.bme.aut.android.weatherinfo.data.network.model` helye. Ez után nyomjunk a *package*-re jobb klikket, majd *New*-> *Kotlin data class File from JSON*.

<p align="center">
<img src="./assets/jsontokotlin.png" width="720">
</p>

A megjelenő ablakban pedig a *JSON Text* helyére illesszük be a válaszként kapott *JSON*-ünket, névnek pedig adjuk meg a `WeatherData`-t.

A plugin létre is hozta nekünk az összes szükséges Kotlin osztált a konverzióhoz.

???info "Modell osztályok"

	`Clouds.kt`:

	```kotlin
	@Serializable
	data class Clouds(
	    val all: Long
	)
	```

	`Coord.kt`:

	```kotlin
	@Serializable
	data class Coord(
	    val lon: Double,
	    val lat: Double
	)
	```

	
	`Main.kt`:

	```kotlin
	@Serializable
	data class Main(
	    val temp: Double,
	
	    @SerialName("feels_like")
	    val feels_like: Double,
	
	    @SerialName("temp_min")
	    val temp_min: Double,
	
	    @SerialName("temp_max")
	    val temp_max: Double,
	
	    val pressure: Long,
	    val humidity: Long,
	    val sea_level: Long,
	    val grnd_level: Long
	)
	```

	`Sys.kt`:

	```kotlin
	@Serializable
	data class Sys(
	    val type: Long,
	    val id: Long,
	    val country: String,
	    val sunrise: Long,
	    val sunset: Long
	)
	```

	`Weather.kt`:

	```kotlin
	@Serializable
	data class Weather(
	    val id: Long,
	    val main: String,
	    val description: String,
	    val icon: String
	)
	```

	`WeatherResult.kt`:

	```kotlin
	@Serializable
	data class WeatherResult(
	    val coord: Coord,
	    val weather: List<Weather>,
	    val base: String,
	    val main: Main,
	    val visibility: Long,
	    val wind: Wind,
	    val clouds: Clouds,
	    val dt: Long,
	    val sys: Sys,
	    val timezone: Long,
	    val id: Long,
	    val name: String,
	    val cod: Long
	)
	```

	`Wind.kt`:

	```kotlin
	@Serializable
	data class Wind(
	    val speed: Double,
	    val deg: Long
	)
	```

####  Repository

Miután megvannak a modell osztályaink, elkészíthetjük a *repository*-t. A `hu.bme.aut.android.weatherinfo.data.network` csomagba készísünk egy `repository` *package*-et, majd abba egy `IWeatherRepository` *interface*-t, aminek egyetlen egy *getWeather()* függvénye lesz.

`IWeatherRepository.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.data.network.repository

import hu.bme.aut.android.weatherinfo.data.network.model.WeatherData
import retrofit2.Call

interface IWeatherRepository {
    suspend fun getWeather(city: String?): Call<WeatherData?>?
}
```

Ezek alapján a `RetrofitWeatherRepository` (amit majd később kiegészítünk a hálózati hívással):

```kotlin
package hu.bme.aut.android.weatherinfo.data.network.repository

import hu.bme.aut.android.weatherinfo.data.network.model.WeatherData
import retrofit2.Call

class RetrofitWeatherRepository : IWeatherRepository {
    override suspend fun getWeather(city: String?): Call<WeatherData?>? {
        return null
    }
}
```

A *getWeather()* függvény visszatérési értéke egy `Call<WeatherData>` típusú objektum lesz. (A retrofites *Call*-t importáljuk a megjelenő lehetőségek közül.) Ez egy olyan hálózati hívást ír le, aminek a válasza *WeatherData* típusú objektummá alakítható.

Példányosítsuk ismét a *repository*-t az *application osztályunkban.

`WeatherInfoApplication.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo

import android.app.Application
import hu.bme.aut.android.weatherinfo.data.local.repository.ICityRepository
import hu.bme.aut.android.weatherinfo.data.local.repository.MemoryCityRepository
import hu.bme.aut.android.weatherinfo.data.network.repository.IWeatherRepository
import hu.bme.aut.android.weatherinfo.data.network.repository.RetrofitWeatherRepository

class WeatherInfoApplication : Application() {
    companion object {

        lateinit var weatherRepository: IWeatherRepository
        lateinit var cityRepository: ICityRepository
    }

    override fun onCreate() {
        super.onCreate()

        weatherRepository = RetrofitWeatherRepository()
        cityRepository = MemoryCityRepository()
    }
}
```

#### A ViewModel

A *viewmodel*-ünk itt is egy állapotot fog tárolni, amiben az időjárásadatok vannak megfigyelhető formában. Készítsük el tehát először ezt az állapotot a `hu.bme.aut.android.weatherinfo.ui.screen.weather.state` *package*-ben.

`WeatherScreenState.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.weather.state

import hu.bme.aut.android.weatherinfo.data.network.model.WeatherData

sealed class WeatherScreenState{
    data object Loading: WeatherScreenState()
    data class Error(val error: Throwable): WeatherScreenState()
    data class Success(val weatherData: WeatherData?): WeatherScreenState()
}
```

Most már jöhet a *viewmodel* a `hu.bme.aut.android.weatherinfo.ui.screen.weather` csomagba.

`WeatherViewModel.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.weather

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import hu.bme.aut.android.weatherinfo.WeatherInfoApplication
import hu.bme.aut.android.weatherinfo.data.network.model.WeatherData
import hu.bme.aut.android.weatherinfo.data.network.repository.IWeatherRepository
import hu.bme.aut.android.weatherinfo.ui.screen.weather.state.WeatherScreenState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import kotlin.jvm.java

class WeatherViewModel(
    private val cityNameArg: String,
    private val weatherRepository: IWeatherRepository
) : ViewModel() {
    private var _state = MutableStateFlow<WeatherScreenState>(WeatherScreenState.Loading)
    val state = _state.asStateFlow()

    private var _cityName = MutableStateFlow<String>(cityNameArg)
    val cityName = _cityName.asStateFlow()

    init {
        getWeather(cityName.value)
    }

    private fun getWeather(cityName: String) {
        viewModelScope.launch {
            _state.value = WeatherScreenState.Loading
            try {
                weatherRepository.getWeather(cityName)
                    ?.enqueue(object : Callback<WeatherData?> {
                        override fun onResponse(
                            call: Call<WeatherData?>,
                            response: Response<WeatherData?>
                        ) {
                            if (response.isSuccessful) {
                                _state.tryEmit(WeatherScreenState.Success(response.body()))
                            }
                        }

                        override fun onFailure(
                            call: Call<WeatherData?>,
                            t: Throwable
                        ) {
                            t.printStackTrace()
                            _state.value = WeatherScreenState.Error(t)
                        }
                    })
            } catch (e: Exception) {
                _state.value = WeatherScreenState.Error(e)
            }
        }
    }

    class WeatherViewModelFactory(private val cityName: String) : ViewModelProvider.Factory {
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            val weatherRepository = WeatherInfoApplication.weatherRepository
            if (modelClass.isAssignableFrom(WeatherViewModel::class.java)) {
                @Suppress("UNCHECKED_CAST")
                return WeatherViewModel(
                    cityNameArg = cityName,
                    weatherRepository = weatherRepository
                ) as T
            }
            throw IllegalArgumentException("Unknown ViewModel class")
        }

    }
}
```

A `WeatherViewModel` paraméterként megkapja az `IWeatherRepository` egy példányát, valamint a lekérdezendő város nevét. Ezen kívül tárolja az állapotot és a városnevet (immár *Flow*-ként. Egyetlen függvénye a hálózati hívást korutinnal elvégző *getWeather()*. Tartalmazza még a saját példányosításához szükséges *Factory method*-ot. 

Figyeljük meg, hogy hogyan adjuk át a *Factory method*-on keresztül a város nevét, illetve a `weatherRepository`-t!

Látható, hogy a *getWeather* függvényben a `weatherRepository` *getWeather* függvényének válaszára (ami egy *Call<WeatherData>* objektum, egy *callbacket* helyeztünk el. Ezzel tudjuk kezelni a hálózati hívásunk különböző állapotait.

### Az időjárás felület

#### Komponensek

Az időjárás képernyőn a város neve, aktuális időjárásának jellemzése és egy ikon mellett a konkrét számszerű értékeket is ki szeretnénk írni. Ennek a megvalósításához hozzunk létre egy segéd *composable*-t a `hu.bme.aut.android.weatherinfo.ui.screen.weather.components` *package*-ben, ami a szövegek és értékek egymás mellé írását fogja segíteni.

`WeatherDataText.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.weather.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp

@Composable
fun WeatherDataText(
    modifier: Modifier = Modifier,
    label: String,
    value: String?,
    textSize: TextUnit = TextUnit.Unspecified
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Text(
            text = label,
            fontSize = textSize
        )
        Text(
            text = value ?: "",
            fontSize = textSize
        )
    }
}

@Composable
@Preview(showBackground = true)
fun WeatherDataTextPreview() {
    WeatherDataText(
        label = "Temperature",
        value = "20",
        textSize = 16.sp
    )
}
```

#### A WeatherScreen elkészítése

Most már minden készen áll ahhoz, hogy elkészítsük az időjárás képernyőnket a `hu.bme.aut.android.weatherinfo.ui.screen.weather` *package*-ben.

`WeatherScreen.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.weather

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import coil.compose.AsyncImage
import coil.request.ImageRequest
import hu.bme.aut.android.weatherinfo.R
import hu.bme.aut.android.weatherinfo.ui.screen.weather.components.WeatherDataText
import hu.bme.aut.android.weatherinfo.ui.screen.weather.state.WeatherScreenState

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WeatherScreen(
    modifier: Modifier = Modifier,
    cityName: String,
    onNavigateBack: () -> Unit
) {
    val weatherViewModel: WeatherViewModel =
        viewModel(factory = WeatherViewModel.WeatherViewModelFactory(cityName), key = cityName)

    val state = weatherViewModel.state.collectAsStateWithLifecycle().value

    val cityName = weatherViewModel.cityName.collectAsStateWithLifecycle().value

    Scaffold(
        modifier = modifier
            .fillMaxSize(),
        topBar = {
            TopAppBar(
                title = { Text(text = stringResource(R.string.label_weather_in, cityName)) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = ""
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
        })
    { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(8.dp)
        ) {
            when (state) {
                is WeatherScreenState.Loading -> {
                    CircularProgressIndicator(
                        color = MaterialTheme.colorScheme.secondaryContainer,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }

                is WeatherScreenState.Error -> {
                    Text(
                        text = state.error.message.toString()
                    )
                }

                is WeatherScreenState.Success -> {
                    Column {
                        Text(
                            text = state.weatherData?.weather?.get(0)?.description ?: "",
                            fontSize = 24.sp
                        )
                        AsyncImage(
                            model = ImageRequest.Builder(context = LocalContext.current)
                                .data("https://openweathermap.org/img/w/${state.weatherData?.weather?.first()?.icon}.png")
                                .crossfade(enable = true)
                                .build(),
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            placeholder = painterResource(id = R.drawable.ic_placeholder),
                            modifier = Modifier
                                .size(320.dp)
                                .align(Alignment.CenterHorizontally)
                        )

                        Spacer(modifier = Modifier.size(24.dp))

                        WeatherDataText(
                            modifier = Modifier.padding(0.dp, 8.dp, 0.dp, 8.dp),
                            label = stringResource(id = R.string.label_temperature),
                            value = "${state.weatherData?.main?.temp} \u2103",
                            textSize = 24.sp
                        )
                        WeatherDataText(
                            modifier = Modifier.padding(0.dp, 8.dp, 0.dp, 8.dp),
                            label = stringResource(id = R.string.label_min_temperature),
                            value = "${state.weatherData?.main?.temp_min} \u2103",
                            textSize = 24.sp
                        )
                        WeatherDataText(
                            modifier = Modifier.padding(0.dp, 8.dp, 0.dp, 8.dp),
                            label = stringResource(id = R.string.label_max_temperature),
                            value = "${state.weatherData?.main?.temp_max} \u2103",
                            textSize = 24.sp
                        )
                        WeatherDataText(
                            modifier = Modifier.padding(0.dp, 8.dp, 0.dp, 8.dp),
                            label = stringResource(id = R.string.label_pressure),
                            value = "${state.weatherData?.main?.pressure} hPa",
                            textSize = 24.sp
                        )
                        WeatherDataText(
                            modifier = Modifier.padding(0.dp, 8.dp, 0.dp, 8.dp),
                            label = stringResource(id = R.string.label_humidity),
                            value = "${state.weatherData?.main?.humidity} %",
                            textSize = 24.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
@Preview
fun WeatherScreenPreview() {
    WeatherScreen(
        cityName = "Budapest",
        onNavigateBack = {})
}
```

A felületünk vázát egy `Scaffold` adja, amiben *topBar*-on kiírjuk a város nevét és felteszünk egy vissza navigációs ikont. Figyeljük meg, hogy hogyan írunk ki paraméteres *stringet* az erőforrások közül!

Az oldal tartalma pedig állapottól függően vagy egy `CircularProgressIndicator`, vagy egy hiba szöveg, vagy pedig az adott város időjárásának adatai. 

Figyeljük meg, hogy hogyan használjuk a kódban a *Coil* library *AsyncImage* függvényét a weben található kép megjelenítésére!


#### Bekötés a navigációba

Egészítsük ki a `Screen` osztályunkat az új képernyővel.

`Screen.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.navigation

import androidx.navigation3.runtime.NavKey
import kotlinx.serialization.Serializable

sealed interface Screen : NavKey {
    @Serializable
    data object CityListScreenDestination : Screen

    @Serializable
    data class WeatherScreenDestination(val cityName: String) : Screen
}
```

Figyeljük meg, hogy hogyan valósítjuk meg azt, hogy a `WeatherScreen`-nek paraméterül át lehessen adni a városnevet!

Ezek után a frissített `AppNavigation`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation3.runtime.entryProvider
import androidx.navigation3.runtime.rememberNavBackStack
import androidx.navigation3.ui.NavDisplay
import hu.bme.aut.android.weatherinfo.ui.screen.citylist.CityListScreen
import hu.bme.aut.android.weatherinfo.ui.screen.weather.WeatherScreen

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = rememberNavBackStack(Screen.CityListScreenDestination)

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = entryProvider {

            entry<Screen.CityListScreenDestination> {
                CityListScreen(
                    modifier = modifier,
                    onCityClick = { backStack.add(Screen.WeatherScreenDestination(cityName = it)) }
                )
            }

            entry<Screen.WeatherScreenDestination> { key ->
                WeatherScreen(
                    modifier = modifier,
                    cityName = key.cityName,
                    onNavigateBack = { backStack.removeLastOrNull() }
                )
            }
        }
    )
}
```

Próbáljuk ki az alkalmazást!

Az időjárás képernyőnk megjelenik, ott van a felirat a fejlécen, de a valós adatok nem láthatóak, hiszen a *repository*-nk mindig egy *null* adattal tér vissza. Ezért csak a töltő képernyőt látjuk.

!!!info
	Ha meg akarjuk nézni a `WeatherScreen`-t teljes egészében, írjuk át a *getWeather* függvény elején az állapotot *Loading*-ról *Success*-re.

	```kotlin
	 viewModelScope.launch {
            _state.value = WeatherState.Success(null)
            try {
				...
	```

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az **időjárás nézet a megfelelő fejléccel** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), a **WeatherScreen** kódja, valamint a **neptun kódod a kódban valahol kommentként**! A képet a megoldásban a repository-ba f2.png néven töltsd föl! 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.


## A Hálózati kommunikáció elkészítése (1 pont)

### A WeatherAPI megvalósítása

A hálózati kérések végrahajtásához a `Retrofit` külső könyvtárat fogjuk használni. Ennek a függőségeit már a labor elején felvettük a megfelelő helyre, most már csak alkalmazni fogjuk a könyvtár funkcióit.

!!! info "Retrofit" 

    A [Retrofit](https://square.github.io/retrofit/) egy általános célú HTTP könyvtár Java és Kotlin környezetben. Széles körben használják, számos projektben bizonyított már (kvázi ipari standard). Azért használjuk, hogy ne kelljen alacsony színtű hálózati hívásokat implementálni.

    Segítségével elég egy interface-ben annotációk segítségével leírni az API-t (ez pl. a [Swagger](https://swagger.io/) eszközzel generálható is), majd e mögé készít a Retrofit egy olyan osztályt, mely a szükséges hálózati hívásokat elvégzi. A Retrofit a háttérben az [OkHttp3](https://github.com/square/okhttp)-at használja, valamint az objektumok JSON formátumba történő sorosítását a [Moshi](https://github.com/square/moshi) libraryvel végzi. Ezért ezeket is be kell hivatkozni.

!!! info "Coil"

    A Coil (Coroutine Image Loader) egy kép betöltő könyvtár Androidra, amely Kotlin koroutinokra épül.   
    A Coil használatának előnyei:  

    - Gyors: A Coil számos optimalizálást végez, beleértve a memória- és lemeztároló gyorsítótárazást, az átméretezést a memóriában, az automatikus kérések szüneteltetését/leállítását és még sok mást.  
    - Könnyű: A Coil kb. 2000 metódust ad az APK-hoz (azoknak az alkalmazásoknak, amelyek már használják az OkHttp és a Coroutines könyvtárakat), ami hasonló a Picasso-hoz és jelentősen kevesebb, mint a Glide és a Fresco könyvtárak.  
    - Könnyen használható: A Coil API-ja a Kotlin nyelv funkcióit használja a könnyű használat és a minimális boilerplate kód érdekében.  
    - Modern: A Coil a Kotlin nyelvűséget helyezi előtérbe és a modern könyvtárakat használja, beleértve a Coroutines-t, az OkHttp-t, az Okio-t és az AndroidX Lifecycles-t.  

???info "Függőségek"
	
	`libs.versions.toml`:

	```toml
	[versions]
	coilCompose = "2.7.0"
	moshi = "1.15.2"
	retrofit = "3.0.0"
	
	[libraries]
	coil-compose = { group = "io.coil-kt", name="coil-compose", version.ref = "coilCompose" }
	squareup-moshi = { group = "com.squareup.moshi", name = "moshi-kotlin", version.ref = "moshi" }
	converter-moshi = { group = "com.squareup.retrofit2", name = "converter-moshi", version.ref = "retrofit" }
	retrofit = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
	```

	modul szintű `build.gradle.kts`:

	```kts
	dependencies{
    implementation(libs.androidx.navigation.compose)
    implementation(libs.retrofit)
    implementation(libs.squareup.moshi)
    implementation(libs.converter.moshi)
    implementation(libs.coil.compose)
	}
	```

Hozzunk létre a `hu.bme.aut.android.weatherinfo.data.network` csomagban egy `WeatherApi` Kotlin fájlt.

`WeatherApi.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.data.network

import hu.bme.aut.android.weatherinfo.data.network.model.WeatherData
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Query

interface WeatherApi {
    @GET("/data/2.5/weather")
    fun getWeather(
        @Query("q") cityName: String?,
        @Query("units") units: String?,
        @Query("appid") appId: String?
    ): Call<WeatherData?>?
}
```

Látható, hogy a *Retrofit*-ben annotációk alkalmazásával tuduk jelezni, hogy az adott függvényhívás milyen hálózati hívásnak fog megfelelni. A `@GET` annotáció *HTTP GET* kérést jelent, a paraméterként adott *string* pedig azt jelzi, hogy hogy a szerver alap *URL*-éhez képest melyik végpontra szeretnénk küldeni a kérést.

!!!note ""
	Hasonló módon tudjuk leírni a többi *HTTP* kérés típust is: *@POST*, *@UPDATE*, *@PATCH*, *@DELETE*

A függvény paremétereit a *@Query* annotációval láttuk el. Ez azt jelenti, hogy a Retrofit az adott paraméter értékét a kéréshez fűzi *query* paraméterként, az annotációban megadott kulccsal.
!!!note ""
	További említésre méltó annotációk a teljesség igénye nélkül: @HEAD, @Multipart, @Field

### A RetrofitWeatherRepository frissítése

Most már készen áll az *interface*-ünk arra, hogy hálózati hívásokat végezzünk rajta keresztül. Cseréljük tehát le a `RetrofitWeatherRepository` *getWeather* függvényében visszaadott *null* értéket az igazi megvalósításra.

`RetrofitWeatherRepository.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.data.network.repository

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import hu.bme.aut.android.weatherinfo.data.network.WeatherApi
import hu.bme.aut.android.weatherinfo.data.network.model.WeatherData
import okhttp3.OkHttpClient
import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory

class RetrofitWeatherRepository : IWeatherRepository {
    private val retrofit: Retrofit
    private val weatherApi: WeatherApi

    companion object {
        private const val SERVICE_URL = "https://api.openweathermap.org"
        private const val APP_ID = "APP_ID"
    }

    init {
        val moshi = Moshi.Builder().addLast(KotlinJsonAdapterFactory()).build()
        retrofit = Retrofit.Builder()
            .baseUrl(SERVICE_URL)
            .client(OkHttpClient.Builder().build())
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
        weatherApi = retrofit.create(WeatherApi::class.java)
    }

    override suspend fun getWeather(city: String?): Call<WeatherData?>? {
        return weatherApi.getWeather(city, "metric", APP_ID)
    }
}
```

Ez az osztály lesz felelős a hálózati kérések lebonyolításáért. 

A `Retrofit.Builder()` hívással kérhetünk egy pareméterezhető `Builder` példányt. Ebben adhatjuk meg a hálózati hívásaink tulajdonságait. Jelen példában beállítjuk az elérni kívánt szolgáltatás címét, a HTTP kliens implementációt ([OkHttp](http://square.github.io/okhttp/)), valamint a JSON és objektum reprezentációk közötti konvertert (Moshi).

A `WeatherApi` interfészből a `Builder`-rel létrehozott `Retrofit` példány segítségével tudjuk elkérni a fordítási időben generált, paraméterezett implementációt.

 A `retrofit.create(WeatherApi.class)` hívás eredményeként kapott objektum megvalósítja a `WeatherApi` interfészt.  Ha ezen az objektumon meghívjuk a `getWeather(...)` függvényt, akkor megtörténik az általunk az interfészben definiált hálózati hívás. 

**Cseréljük le** az `APP_ID` értékét az [OpenWeatherMap](https://openweathermap.org/) oldalon kapott saját API kulcsunkra!

Próbáljuk ki az alkalmazást!

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az emulátoron egy **város időjárása** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), a **RetrofitWeatherRepository** kódja, valamint a **neptun kódod a kódban valahol kommentként**! A képet a megoldásban a repository-ba f3.png néven töltsd föl! 

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

## Önálló feladat 1: város listából törlés megvalósítása (1 pont)

Valósítsuk meg a városok törlését az elemek balra elhúzásának hatására!

A város kártyák oldalra elhúzhatóságát egy *SwipeToDismissBox* segítségével fogjuk megvalósítani. Egészítsük ki tehát a `CityCard`-ot:

`CityCard.kt`:

```kotlin
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CityCard(
    city: String,
    onCityClick: (String) -> Unit,
    onDelete: (String) -> Unit
) {
    val dismissState = rememberSwipeToDismissBoxState(confirmValueChange = {
        if (it == SwipeToDismissBoxValue.EndToStart) {
            onDelete(city)
        }
        return@rememberSwipeToDismissBoxState true
    },
        // positional threshold of 25%
        positionalThreshold = { it * .25f }
    )
    OutlinedCard(
        modifier = Modifier
            .fillMaxWidth(),
        shape = RoundedCornerShape(16.dp)
    ) {
        SwipeToDismissBox(
            enableDismissFromStartToEnd = false,
            state = dismissState,
            backgroundContent = {
                Row(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            when (dismissState.dismissDirection) {
                                SwipeToDismissBoxValue.EndToStart -> Color.Red
                                else -> MaterialTheme.colorScheme.background
                            }
                        )
                        .padding(12.dp, 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.End
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Delete"
                    )
                }
            }
        ) {
            ListItem(
				...
			)
		}
	}
}
```

Figyeljük meg, hogy a SwipeToDismissBox-nál hogyan tiltjuk le a balra húzást, és hogyan állítjuk be az állapotát!

Ezek után már csak a listából való törlést kell megvalósítanunk.

???success "A megvalósítás lépései"
	- törlés függvény a *repository interface*-be
	- törlés függvény a *repository*-ba
	- törlés függvény a *viewmodel*-be
	- törlés esemény a `CityListScreenEvent`-be
	- törlés eseménykezelő az `onEvent` függvénybe
	- törlés eseményt küldeni az elhúzás hatására

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik az emulátoron a **városok listája CSAK Budapesttel** (emulátoron, készüléket tükrözve vagy képernyőfelvétellel), a **törlés releváns** kódrészlete, valamint a **neptun kódod a kódban valahol kommentként**! A képet a megoldásban a repository-ba f4.png néven töltsd föl!

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

## Önálló feladat 2: városok perzisztens mentése (1 pont)

Valósítsuk meg a városok adatbázisba mentését!

???success "A megvalósítás lépései"
	- egészítsük ki a model osztályt, hogy Room-ba menthető legyen
	- hozzunk létre egy DAO osztályt
	- hozzuk létre az adatbázist
	- cseréljük le a `cityRepository` inicializálását

!!!example "BEADANDÓ (1 pont)"
	Készíts egy **képernyőképet**, amelyen látszik a **perzisztens mentés releváns** kódrészlete, valamint a **neptun kódod a kódban valahol kommentként**! A képet a megoldásban a repository-ba f5.png néven töltsd föl!

	A képernyőkép szükséges feltétele a pontszám megszerzésének.

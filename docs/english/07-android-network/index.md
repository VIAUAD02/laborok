# Labor 07 - Retrofit - Weather app

## Introduction

The task of this lab is to create an application that displays weather information. In addition to using the UI elements we saw earlier, we will also see an example of an efficient implementation of network communication using the [`Retrofit`](https://square.github.io/retrofit/) library.

The application displays a list of cities in a [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists) and queries the weather data of the selected city using the *REST API* of [OpenWeatherMap](https://openweathermap.org/). A new city can be added by pressing a [`FloatingActionButton`](https://developer.android.com/guide/topics/ui/floating-action-button).

!!!info "REST"
    REST = [Representational State Transfer](https://en.wikipedia.org/wiki/Representational_state_transfer)

Technologies used:

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


## Application Specification

The application consists of an `Activity`.

The `CityListScreen` that appears when the application starts displays a list of cities added by the user. Dragging the cities to the left deletes the given city from the list. A new city can be added by pressing the *FloatingActionButton* in the lower right corner of the view.

Clicking on a city brings up a new *Composable* screen with the weather data for that city. In addition to a short description, a current icon and the average, minimum and maximum temperature, air pressure and humidity values ​​for the city are displayed.

<p align="center">
<img src="./assets/list.png" width="240">
<img src="./assets/dialog.png" width="240">
<img src="./assets/weather.png" width="240">
</p>


## Lab tasks

During the lab, the following tasks must be completed with the help of the lab leader, and the designated tasks must be completed independently.

1. Implementing MVI architecture: 1 point
1. Creating a weather view: 1 point
1. Implementing network communication: 1 point
1. Independent task: implementing deleting a city from the list: 1 point
1. Independent task: implementing persistent backup: 1 point

During the lab, a complex weather application will be created. Due to the limited time frame of the lab, it will be necessary to copy larger code blocks, but in any case, pay attention to the lab leader's explanation so that the code sections are understandable. The goal is to understand the presented codes and learn how to use the libraries used.


## Preparations

When solving the tasks, do not forget to follow the [task submission process](../github/).

### Creating and downloading a Git repository

1. Find the lab invitation URL in Moodle and use it to create your own repository.

1. Wait until the repository is ready, then checkout it.

    !!! tip ""
        In university labs, if the system does not ask for a username and password during checkout and the checkout fails, the system probably tried to use a username previously saved on the computer. First, delete the saved login data and try again.

1. Create a new branch called `solution` and work on this branch.

1. Write your Neptun code in the `neptun.txt` file. Nothing else should be in the file, except the 6 characters of the Neptun code on a single line.


### Creating a project

In this lab, we will not create a new project, but will start from an existing one, which already contains the basics learned in the previous labs. The project can be found in the checked out repository under the name *WeatherInfo*. Let's open the project and review its structure with the lab leader!

#### Dependencies

The project includes all the dependencies needed during the lab, they don't need to be added again later, but we will include them in the given section.


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


Project level `build.gradle.kts`:

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

Modul level `build.gradle.kts`:

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
    `Retrofit` generates an implementation of HTTP calls based on simple, properly annotated interfaces described by the developer. It handles parameters given inline in the URL, URL queries, etc. It also supports the most popular serialization/deserialization solutions (e.g.: [`Gson`](https://github.com/google/gson), [`Moshi`](https://github.com/square/moshi), [`Simple XML`](https://sourceforge.net/projects/simple/), etc.), which can be used to implement bidirectional conversion between Java/Kotlin objects and JSON or XML format data. In the lab, we will use `Moshi` to convert weather data received in JSON.

!!!info "Coil"
    `Coil` is an efficient image loading and caching library for Android. We use it because of its simple *interface* and efficiency.


### Resources

The project includes the application icons, the necessary graphic resources, and the text resources:

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

#### The model

Our application will display a list of cities on its main screen. This will be important for both the user interface and data storage, so it will be placed in the `model` *package* within the `domain` *package*.

`City.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.domain.model

class City(
    var id: Int,
    var name: String
)
```

Our item contains an ID as well as a name for the city.


#### The repository

Although we currently store our city list only in memory, for future extensibility we keep the previously learned *repository* pattern in the `data.local.repository` *package*:

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

You can see that we are currently working with a triple list, and each new city is given an ID incrementally.

After creating the *repository*, let's instantiate it in our *application* class in the `hu.bme.aut.android.weatherinfo` *package*.

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

Then, in `AndroidManifest.xml`, we configure the use of our *application* class.

`AndroidManifest.xml`:


```xml
...
<application
        android:name=".WeatherInfoApplication"
...
```


#### The user interface

In addition to displaying cities, we also need to allow adding new cities. We will do this with a simple generic dialog where the user can enter some text. Since this is not an interface-specific element, it will be placed in the `ui.common` *package*:

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

This function has two lambda parameters: `onDismiss` will be responsible for dismissing our dialog window, and `onConfirm` will allow us to add a new city. We pass these lambda parameters as parameters to the other functions as follows:

- `onDismiss` - This parameter should be received by both buttons, because if we add a new city we want the window to disappear, and if we change our mind and do not want to add a new city, the window should still be deleted.
- `onConfirm` - We will only put this on the positive button, with a *string* parameter, which will be variable according to the input field.

The user interface of our application is currently quite simple. It contains a *screen*, which contains a `TopBar`, the list of items and a `FloatingActionButton`. Pressing the button opens the `StringInputDialog` dialog window for adding a new item. `CityListScreen` and its associated `CityListViewModel` are located in the `hu.bme.aut.android.weatherinfo.ui.screen.citylist` *package*, and its building blocks are located within a `components` *package*:

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

Here you can see that in addition to the city name, we are taking two event handlers: one for clicking on the city and one for deleting it. We have not created our own complex layout for the display, but rather use the built-in `ListItem` *composable*. The functionality we need, such as writing out some text and inserting an image, can be easily done with the *headlineContent* and *leadingContent* *properties.

Now that we have our components, let's move on to `CityListViewModel`:

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

After this, we can now compile `CityListScreen`:

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

#### Navigation

Although we only have one screen right now, the project already has navigation prepared according to what we learned in previous labs:

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

Now all we have to do is display `AppNavigation` on `MainActivity`:

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

Let's try the app!

Our list is now displayed, and we can even expand it.


### Adding permissions
The application will need internet access. In the `AndroidManifest.xml` file, add the *Internet permission* outside the `application` tag*:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```


!!!info "Permissions"
    Since API 23 (6.0, Marshmallow) on Android, permissions have been divided into two groups. Permissions in the *normal* group can be added to the `AndroidManifest.xml` file as shown above and the application will automatically receive them. In the case of permissions in the *dangerous* group, this is no longer enough; they must be explicitly requested from the user at runtime, who can deny the application the requested permission at any time. You can learn more about managing permissions at [developer.android.com](https://developer.android.com/guide/topics/permissions/overview).


### OpenWeatherMap API key

Register your own user on the [OpenWeatherMap](https://openweathermap.org/) page and create an API key, which will allow you to use the service in your application!

1. Click on *Sign in* and then on the *Create an account* button.
1. Fill out the registration form
1. The value of the *Company* field should be "BME", the value of the *Purpose* should be "Education/Science"
1. After successful registration, the API key created by default can be found on the *API keys* tab.

We will need the API key later when making an API call to retrieve weather data.


## MVI architecture (1 point)

In the previous labs (and in this project as well), we used the *MVVM* architecture in the UI layer. That is, a *ViewModel* contained our data to be displayed, our list. Now, however, since our data will come from a remote source, and we cannot be sure that it will arrive in order, it may be worth handling the data and the interface states separately. Therefore, we will switch to the *MVI* pattern. Here, we will store the interface state in a separate class, `CityListScreenState`, and the interface will be able to extract the relevant data from it.

### City list state


#### The ViewModel

So let's create a new *package* called `state` inside `hu.bme.aut.android.weatherinfo.ui.screen.citylist`, and then place `CityListScreenState` inside it. We will also implement this as the already known *sealed class*:

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

Here you can see that we expect three different possible states:

- *Loading*: the data is still loading.
- *Error*: an error occurred while loading the data
- *Result*: the result is there, it can be read from the contained list.

After this, `CityListViewModel` transforms as follows:

`CityListViewModel.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.feature.citylist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import hu.bme.aut.android.weatherinfo.WeatherInfoApplication
import hu.bme.aut.android.weatherinfo.data.local.model.City
import hu.bme.aut.android.weatherinfo.data.local.repository.ICityRepository
import hu.bme.aut.android.weatherinfo.feature.citylist.state.CityListState
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

So here we are not storing the city list, but `CityListScreenState` as the state, and making it available to `CityListScreen`. When loading the data, we first set the state to *Loading*, and then, depending on the result, we move on to either *Result* or *Error*.

#### Screen

After this, `CityListScreen` will look like this:

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

Let's see how we handle each state on the interface!

### Events

Another cornerstone of the *MVI* architecture, besides storing state, is that interactions/events are sent from the *Screen* to the *ViewModel* instead of simple function calls. In the current interface (without claiming to be complete), we will introduce this when adding a new city and deleting individual cities. Let's first add the addition event to a separate class in the `hu.bme.aut.android.weatherinfo.ui.screen.citylist.event` *package*:

`CityListScreenEvent.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.ui.screen.citylist.event

sealed class CityListScreenEvent {
    data class CityCreated(val city: String) : CityListScreenEvent()
}
```

You can see that we also pass the city as a parameter with the event.

After that, we handle the events in `CityListViewModel`:

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

After that, we can make the `addCity` function of `CityListViewModel` private.

So of course we need to change the call in `CityListScreen` as well:

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

We can see that with this step we have further separated the *Screen* and the *ViewModel* architecturally.

Let's try the application!

!!!example "TO BE SUBMITTED (1 point)"
    Create a **screenshot** showing the **list of city names with a newly added city named your NEPTUN code** (on emulator, mirroring device or by screenshot), the **CityListViewModel** code, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f1.png!

The screenshot is a necessary condition for getting a score.


## The Weather View (1 point)

### Building the Architecture

Our data flow will be similar to what we saw earlier, (*repository* -> *viewmodel(state)* -> *screen*) so let's create these.

#### Model Classes

The [OpenWeatherMap API](https://openweathermap.org/current) will return the current weather in a JSON object in response to our requests.

!!!info "API call (replace {appID} with your own)"
	https://api.openweathermap.org/data/2.5/weather?q=Budapest&units=metric&appid={appId}

???info "Api response"
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

In order to make objects that we can use from this, we will need the model class(es) and the `Moshi` library, which performs the conversion. In this phase, we first create the model classes. As you can see, the resulting *JSON* is quite complicated and contains many subnodes. Fortunately, we don't have to manually parse our classes from *JSON*. On the one hand, most *APIs* provide an extensive description of the model, and on the other hand, there are many converters for the *JSON* -> *Kotlin class* conversion. We will now ask for the help of an Android Studio Plugin.

Find *Plugins* in the Android Studio settings, and there, in the *Marketplace* search box, enter *JSON To Kotlin Class*, and install the *plugin* found.

<p align="center">
<img src="./assets/plugin.png" width="720">
</p>

Once you have this, create the *package* of the model classes at `hu.bme.aut.android.weatherinfo.data.network.model`. After that, right-click on the *package*, then *New*-> *Kotlin data class File from JSON*.

<p align="center">
<img src="./assets/jsontokotlin.png" width="720">
</p>

In the window that appears, replace *JSON Text* with the *JSON* we received as the response, and give the name `WeatherData`.

The plugin also created all the necessary Kotlin classes for the conversion.

???info "Model classes"

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

Once we have our model classes, we can create the *repository*. We will create a `repository` *package* in the `hu.bme.aut.android.weatherinfo.data.network` package, and then an `IWeatherRepository` *interface* in it, which will have a single *getWeather()* function.

`IWeatherRepository.kt`:

```kotlin
package hu.bme.aut.android.weatherinfo.data.network.repository

import hu.bme.aut.android.weatherinfo.data.network.model.WeatherData
import retrofit2.Call

interface IWeatherRepository {
    suspend fun getWeather(city: String?): Call<WeatherData?>?
}
```

Based on this, `RetrofitWeatherRepository` (which we will later supplement with the network call):

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

The return value of the *getWeather()* function will be an object of type `Call<WeatherData>`. (We import the retrofitted *Call* from the options that appear.) This describes a network call whose response can be converted into an object of type *WeatherData*.

Let's instantiate *repository* again in our *application class.

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

#### The ViewModel

Our *viewmodel* will also store a state in which the weather data is in observable form. So let's first create this state in the `hu.bme.aut.android.weatherinfo.ui.screen.weather.state` *package*.

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

Now the *viewmodel* can be added to the `hu.bme.aut.android.weatherinfo.ui.screen.weather` package.

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

The `WeatherViewModel` receives an instance of `IWeatherRepository` as a parameter, as well as the name of the city to be queried. It also stores the state and the city name (now as *Flow*). Its only function is *getWeather()*, which makes the network call with a coroutine. It also contains the *Factory method* necessary for its own instantiation.

Let's notice how we pass the city name and `weatherRepository` through the *Factory method*!

You can see that in the *getWeather* function, we have placed a *callback* for the response of the *getWeather* function of the `weatherRepository` (which is a *Call<WeatherData>* object). This allows us to handle the different states of our network call.

### The weather interface

#### Components

On the weather screen, in addition to the name of the city, the description of its current weather and an icon, we also want to display specific numerical values. To achieve this, let's create a helper *composable* in the `hu.bme.aut.android.weatherinfo.ui.screen.weather.components` *package*, which will help write texts and values ​​next to each other.

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

#### Creating the WeatherScreen

Now we are ready to create our weather screen in the `hu.bme.aut.android.weatherinfo.ui.screen.weather` *package*.

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

The framework of our interface is a `Scaffold`, in which we display the name of the city on the *topBar* and add a back navigation icon. Notice how we display a parameterized *string* from the resources!

Depending on the state, the content of the page is either a `CircularProgressIndicator`, an error text, or the weather data for the given city.

Notice how we use the *AsyncImage* function of the *Coil* library in the code to display the image found on the web!


#### Connection to navigation

Let's supplement our `Screen` class with the new screen.

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

Let's see how we implement the city name to be passed as a parameter to `WeatherScreen`.

Here's the updated `AppNavigation`:

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

Let's try the application!

Our weather screen appears, there is the caption in the header, but the real data is not visible, since our *repository* always returns a *null* data. Therefore, we only see the loading screen.

!!!info
    If we want to see the `WeatherScreen` in its entirety, let's change the status at the beginning of the *getWeather* function from *Loading* to *Success*.

	```kotlin
	 viewModelScope.launch {
            _state.value = WeatherState.Success(null)
            try {
				...
	```

!!!example "TO BE SUBMITTED (1 points)"
    Create a **screenshot** showing the **weather view with the appropriate header** (on emulator, device mirroring or screen capture), the **WeatherScreen** code, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f2.png!

    The screenshot is a necessary condition for obtaining a score.


## Creating the Network Communication (1 point)

### Implementing the WeatherAPI

To execute network requests, we will use the `Retrofit` external library. We added its dependencies to the appropriate place at the beginning of the lab, now we will only use the library functions.

!!! info "Retrofit"

    [Retrofit](https://square.github.io/retrofit/) is a general-purpose HTTP library for Java and Kötlin. It is widely used, proven in many projects (quasi-industry standard). We use it to avoid having to implement low-level network calls.

    With it, you just need to describe the API in an interface using annotations (this can be generated with [Swagger](https://swagger.io/)), and then Retrofit creates a class behind it that makes the necessary network calls. Retrofit uses [OkHttp3](https://github.com/square/okhttp) in the background, and serializes objects into JSON format with the [Moshi](https://github.com/square/moshi) library. Therefore, these must also be referenced.

!!! info "Coil"

    Coil (Coroutine Image Loader) is an image loading library for Android built on Kotlin coroutines.
    Benefits of using Coil:

    - Fast: Coil performs many optimizations, including memory and disk caching, in-memory resizing, automatic request pausing/stopping, and more.
    - Lightweight: Coil adds about 2000 methods to the APK (for apps that already use the OkHttp and Coroutines libraries), which is similar to Picasso and significantly less than the Glide and Fresco libraries.
    - Easy to use: Coil's API uses Kotlin language features for ease of use and minimal boilerplate code.
    - Modern: Coil prioritizes the Kotlin language and uses modern libraries including Coroutines, OkHttp, Okio, and AndroidX Lifecycles.

???info "Dependencies"

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

	modul level `build.gradle.kts`:

	```kts
	dependencies{
    implementation(libs.androidx.navigation.compose)
    implementation(libs.retrofit)
    implementation(libs.squareup.moshi)
    implementation(libs.converter.moshi)
    implementation(libs.coil.compose)
	}
	```

Let's create a `WeatherApi` Kotlin file in the `hu.bme.aut.android.weatherinfo.data.network` package.

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

As you can see, in *Retrofit* we can use annotations to indicate what network call a given function call will correspond to. The `@GET` annotation represents an *HTTP GET* request, and the *string* given as a parameter indicates which endpoint we want to send the request to relative to the server's base *URL*.

!!!note ""
	We can describe other *HTTP* request types in a similar way: *@POST*, *@UPDATE*, *@PATCH*, *@DELETE*

The function parameters are annotated with the *@Query* annotation. This means that Retrofit appends the value of the given parameter to the request as a *query* parameter, with the key specified in the annotation.
!!!note ""
    Other noteworthy annotations, but not exhaustive: @HEAD, @Multipart, @Field

### Updating the RetrofitWeatherRepository

Now our *interface* is ready to make network calls through it. So let's replace the *null* value returned by `RetrofitWeatherRepository`'s *getWeather* function with the actual implementation.

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

This class will be responsible for handling network requests.

We can request a parameterizable `Builder` instance by calling `Retrofit.Builder()`. In this, we can specify the properties of our network calls. In this example, we set the address of the service we want to access, the HTTP client implementation ([OkHttp](http://square.github.io/okhttp/)), and the converter between JSON and object representations (Moshi).

From the `WeatherApi` interface, we can request the parameterized implementation generated at compile time using the `Retrofit` instance created with `Builder`.

The object obtained as a result of the `retrofit.create(WeatherApi.class)` call implements the `WeatherApi` interface. If we call the `getWeather(...)` function on this object, the network call we defined in the interface will be made.

**Replace** the `APP_ID` ​​value with your own API key obtained from [OpenWeatherMap](https://openweathermap.org/)!

Let's try the application!

!!!example "TO BE SUBMITTED (1 point)"
    Create a **screenshot** showing the **weather of a city** on the emulator (on the emulator, by mirroring the device or by taking a screenshot), the **RetrofitWeatherRepository** code, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f3.png!

    The screenshot is a necessary condition for getting points.

## Independent task 1: implementing city deletion from the list (1 point)

Let's implement deleting cities by swiping the elements to the left!

We will implement the ability to swipe the city cards to the side using a *SwipeToDismissBox*. So let's complete `CityCard`:

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

Notice how we disable the swipe left and set its state in SwipeToDismissBox!

Now all we need to do is delete from the list.

???success "Steps of implementation"
    - delete function in *repository interface*
    - delete function in *repository*
    - delete function in *viewmodel*
    - delete event in `CityListScreenEvent`
    - delete event handler in `onEvent` function
    - send delete event in response to drag

!!!example "TO BE SUBMITTED (1 point)"
    Make a **screenshot** showing the **list of cities ONLY with Budapest** on the emulator (on emulator, mirroring device or with a screenshot), the **delete relevant** code snippet, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f4.png!

    The screenshot is a necessary condition for getting the score.

## Independent task 2: persistent saving of cities (1 point)

Let's implement saving the cities to the database!

???success "Implementation Steps"
    - extend the model class so that it can be saved to Room
    - create a DAO class
    - create the database
    - replace the `cityRepository` initialization

!!!example "TO BE SUBMITTED (1 point)"
    Take a **screenshot** showing the **relevant** code snippet for the **persistent save**, as well as your **Neptune code somewhere in the code as a comment**! Upload the image to the repository in the solution as f5.png!

    The screenshot is a necessary condition for obtaining points.

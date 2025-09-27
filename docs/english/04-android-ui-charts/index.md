# Labor 04 - UI,HorizontalPager, Charts - HR application

## Introduction

During the lab, we will create an HR application, which allows the user to view their personal data and record time off. The application does not use persistent data storage or real login, it only works with demo data. The main topics of the lab will be creating interfaces with HorizontalPager and Charts.

<p align="center">
<img src="./assets/menu.png" width="160">
<img src="./assets/profile1.png" width="160">
<img src="./assets/profile2.png" width="160">
<img src="./assets/holiday.png" width="160">
<img src="./assets/datepicker.png" width="160">
</p>


!!! warning "IMSc"
	After successfully completing the lab tasks, 2 IMSc points can be earned by solving the IMSc task.

## Rating

Grading:

- Main menu screen: 1 point
- Profile screen: 1 point
- Holiday screen: 1 point
- Date picker, reducing days: 1 point
- Independent task (further development of holiday): 1 point

IMSc: Implementation of the payment menu item

- Pie chart: 1 IMSc point
- Bar chart: 1 IMSc point

## Preparations

When solving the tasks, do not forget to follow the [task submission process](../github/GitHub.md).

### Creating and downloading a Git repository

1. Find the lab invitation URL in Moodle and use it to create your own repository.

2. Wait until the repository is ready, then checkout it.

    !!! tip ""
        In university labs, if the system does not ask for a username and password during checkout and the checkout fails, the system probably tried to use a username previously saved on the computer. First, delete the saved login data and try again.

3. Create a new branch called `solution` and work on this branch.

4. Write your Neptun code in the `neptun.txt` file. The file should contain nothing else, except the 6 characters of the Neptun code on a single line.

## Create a project

Let's create a new Android project with the 'Empty Activity' template! The application name should be `WorkplaceApp`, and the Package name should be `hu.bme.aut.android.workplaceapp`.

!!!danger "FILE PATH"
    The project should be placed in the WorkplaceApp directory in the repository, and it should be pushed when submitted! Without the code, we cannot give maximum points to the lab!

We can use the default minimum SDK level of 24 and the Kotlin DSL.

First, download the [compressed file] containing the application images (./downloads/res.zip) and extract it. Copy the mipmap directory in it to the app/src/main/res folder (in Studio, while standing in the res folder, press `Ctrl+V`).

!!!info "Managing screens in Android apps"
	Most mobile applications are built from a combination of distinct pages/screens. One of the first major decisions we have to make when designing an application is how to structure these screens and how to implement navigation between them. In the case of an Android-based application, we can choose from several solutions:

    - *Activity-based approach*: Each screen is an **Activity**. Since **Activity** is a system-level component of Android, the operating system is responsible for managing it. We never instantiate it directly, but send an **Intent** to the system. The system is also responsible for navigation, and we can set certain options using *flags*.
    - *Composable-based approach*: In this case, our screens are built from one or more *Composable* elements. These are managed at the application level, so an **Activity** is definitely required, which is responsible for the display. The display and navigation are performed by the **NavGraph** class.
    - *Other unique solution*: Using an external or own library for display, which typically derives from the basic **View** class. Examples include the old *Conductor* and *Jetpack Compose*.

    In the past, applications used the Activity-based approach, but later switched to Fragments. In such applications, there is a total of one main **Activity**, which contains the **FragmentManager** instance, which we will later use to display **Fragment**-based screens.

    This was a fundamentally flexible and easy-to-use solution, but for this we had to get to know the **FragmentManager** operation in detail, otherwise we could easily run into errors. To solve this, Google developed the *Navigation Component* package, with which we can easily create navigation between pages in the Android Studio environment with a graphical tool, or we can simply start it from code.

    In Jetpack Compose, **NavHost** is now responsible for navigation and calls each *Composable* function separately.

## NavHost Compose initialization
First, let's add the Navigation Component package to our empty project. To do this, we'll need the module-level `build.gradle.kts` file and the `libs.versions.toml` file. Find these and add the following dependency:

`libs.versions.toml`
```toml
[versions]
...
navigationCompose = "2.7.7"


[libs]
...
androidx-navigation-compose = { module = "androidx.navigation:navigation-compose", version.ref = "navigationCompose" }
```

`build.gradle.kts`

```kts
dependencies {
    ...
    implementation(libs.androidx.navigation.compose)

}
```

Once you're done with this, sync the project using the `Sync Now` button in the upper right corner.


!!!warning "Sync"
    Make sure to Sync, because if you skip this step, it won't find the necessary dependencies, which can cause problems later!

The Navigation Component also uses *Jetpack Compose* to define a navigation graph for the screens and the relationships between them. However, we can specify this graph directly in *Kotlin* code. To create it, follow these steps:

1. Create the navigation graph using Jetpack Compose.

2. Create a *package* called `navigation`, and then create a new *Kotlin File* called `NavGraph` in this *package* (*right click -> New Kotlin Class/File*)

3. Create `NavGraph` similar to `NavGraph` seen in previous labs:
```kotlin
package hu.bme.aut.android.workplaceapp.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController

@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
){
    NavHost(
        navController = navController,
        startDestination = Screen.Screen1.route
    ){
//        composable(Screen.Screen1.route){
//            Screen1()
//        }
//        composable(Screen.Screen2.route){
//            Screen2()
//        }
    }
}
```

4. As you can see, instead of using *strings* that are given by hand, we use references to identify *destinations*. We collect these references in a separate `Screen` *sealed class*:
```kotlin
package hu.bme.aut.android.workplaceapp.navigation

sealed class Screen(val route: String) {
    object Menu : Screen("menu")
    object Screen1: Screen("screen1")
    object Screen2: Screen("screen2")
}
```
!!!info "sealed class"
	Kotlin's *sealed classes* are classes that have limited inheritance, and all their descendants are known at compile time. We can use these classes in a similar way to enums. In this case, Menu is not actually a direct descendant of Screen, but an anonymous descendant.

5. Once we're done with this, we just need to extend this `NavGraph` as needed, and in `MainActivity`, we need to call this Composable function, and it will automatically bring up the configured main screen when the application is launched.
```kotlin
package hu.bme.aut.android.workplaceapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import hu.bme.aut.android.workplaceapp.navigation.NavGraph
import hu.bme.aut.android.workplaceapp.ui.theme.WorkplaceAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            WorkplaceAppTheme {
                NavGraph()
            }
        }
    }
}
```

!!!info "Multiple Navigation Graphs"
    Jetpack Compose allows you to create and manage multiple navigation graphs, but for most applications, a single `NavGraph` is sufficient


## Main Menu Screen (1 point)

The first screen we will create will be the main page, from which we can navigate to the other pages. During the lab, we will implement 2 functions, these are Profile and Freedom.

On the `MenuScreen`, we want to display a TopAppBar and buttons. 

<p align="center">
<img src="./assets/menu.png" width="160">
</p>

First, let's create a `hu.bme.aut.android.workplaceapp.ui.view` *package*. This will contain our essential UI building blocks:

`TopBar.kt`: 

```kotlin
package hu.bme.aut.android.workplaceapp.ui.view

import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TopBar(
    label: String = "Title"
) {
    TopAppBar(
        title = { Text(text = label) },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = MaterialTheme.colorScheme.inversePrimary
        )
    )
}

@Composable
@Preview
fun PreviewTopBar() {
    TopBar("Workplace App")
}
```

This is a simple *AppBar*, with which we can place a title, different *actions*, and buttons.

`ImageButton`:

```kotlin
package hu.bme.aut.android.workplaceapp.ui.view

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import hu.bme.aut.android.workplaceapp.R

@Composable
fun ImageButton(
    modifier: Modifier,
    label: String,
    painter: Painter,
    size: Dp,
    contentDescription: String? = null,
    onClick: () -> Unit
) {
    OutlinedButton(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        contentPadding = PaddingValues(
            start = 0.dp,
            top = 0.dp,
            end = 0.dp,
            bottom = 0.dp
        ),
        border = BorderStroke(1.dp, darkColorScheme().onPrimary)

    ) {
        Box(modifier = modifier.padding(0.dp)) {
            Image(
                contentScale = ContentScale.Crop,
                modifier = modifier
                    .align(Alignment.Center)
                    .size(size),
                painter = painter,
                contentDescription = contentDescription
            )
            Text(
                color = Color.Black,
                modifier = modifier.align(Alignment.Center),
                text = label
            )

        }
    }
}

@Composable
@Preview
fun PreviewImageButton() {
    ImageButton(
        modifier = Modifier,
        label = "Holiday",
        painter = painterResource(id = R.drawable.holiday),
        size = 160.dp,
        contentDescription = "Holiday",
        onClick = {}
    ) 
}
```

Ez egy egyszerű gomb, amin képeket és szövekeget is könnyen tudunk elhelyezni. Az univerzális felhasználás érdekében a lényeges attribútumok kivezetésre kerültek paraméterekként. 

Most már minden rendelkezésünkre áll, hogy megírjuk a `MainScreen` képernyőnket is. Ehhez hozzunk létre egy új `hu.bme.aut.android.workplaceapp.feature` *package*-et. Ebben lesznek külön *package*-ekben a képernyőink. A `hu.bme.aut.android.workplaceapp.feature.menu` *package*-be hozzuk létre a  `MenuScreen` *Kotlin File*-t:

```kotlin
package hu.bme.aut.android.workplaceapp.feature.menu

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import hu.bme.aut.android.workplaceapp.R
import hu.bme.aut.android.workplaceapp.ui.view.ImageButton
import hu.bme.aut.android.workplaceapp.ui.view.TopBar

@Composable
fun MenuScreen(
    modifier: Modifier = Modifier,
    onProfileButtonClick: () -> Unit,
    onHolidayButtonClick: () -> Unit,
    onSalaryButtonClick: () -> Unit,
    onCafeteriaButtonClick: () -> Unit
) {
    Scaffold (
        topBar = { TopBar(label = stringResource(id = R.string.app_name)) }
    ) { innerPadding ->
        Box(
            modifier = modifier
                .fillMaxSize()
                .background(MaterialTheme.colorScheme.background)
                .padding(innerPadding),
            contentAlignment = Alignment.Center
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    ImageButton(
                        onClick = onProfileButtonClick,
                        modifier = modifier,
                        label = stringResource(R.string.profile),
                        painter = painterResource(id = R.drawable.profile),
                        size = 160.dp,
                        contentDescription = stringResource(R.string.profile)
                    )
                    Spacer(
                        modifier = Modifier.height(16.dp)
                    )
                    ImageButton(
                        onClick = onSalaryButtonClick,
                        modifier = modifier,
                        label = stringResource(R.string.salary),
                        painter = painterResource(id = R.drawable.payment),
                        size = 160.dp,
                        contentDescription = stringResource(R.string.salary)
                    )

                }
                Spacer(
                    modifier = Modifier.width(16.dp)
                )
                ///TODO
            }
        }
    }
}

@Preview
@Composable
fun MenuScreenPreview() {
    MenuScreen(
        onProfileButtonClick = {},
        onHolidayButtonClick = {},
        onCafeteriaButtonClick = {},
        onSalaryButtonClick = {}
    )
}
```

Following this example, let's implement the other two buttons with the following values:

|Text|Image|
|------|---|
|`Holiday`|`@drawable.holiday`|
|`Cafeteria`|`@drawable.cafeteria`|

Let's create the referenced text resources! (While standing on the text, press <kbd>ALT</kbd>+<kbd>ENTER</kbd>)

After that, let's add our `Screen` class and our `NavGraph`:

```kotlin
package hu.bme.aut.android.workplaceapp.navigation

sealed class Screen(val route: String) {
    object Menu : Screen("menu")
}
```

```kotlin
package hu.bme.aut.android.workplaceapp.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import hu.bme.aut.android.workplaceapp.feature.menu.MenuScreen

@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Menu.route
    ) {
        composable("menu") {
            MenuScreen(
                onProfileButtonClick = {},
                onHolidayButtonClick = {},
                onSalaryButtonClick = {},
                onCafeteriaButtonClick = {})
        }
    }
}
```

If we start the application now, we see all 4 buttons, but none of them work yet.

!!!example "TO BE SUBMITTED (1 point)"
    Make a **screenshot** showing the **finished homepage image** (on an emulator, mirroring the device or with a screen capture), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f1.png!

    The screenshot is a necessary condition for obtaining a score.


## Creating a Profile Screen (1 point)

The Profile screen will consist of two pageable pages (`HorizontalPager`), which will contain the following information:

- First page
    - Name
    - Email
    - Address
- Second page
    - Personal number
    - Social security number
    - Tax number
    - Social security number

Let's create a `data` *package*, within which there will be a `Person` data class. This will store the data displayed on the pages. For data type classes, Kotlin automatically generates frequently used functions, such as the `equals()` and `hashCode()` functions for comparing different objects, as well as a `toString()` function that returns the value of the stored variables.


```kotlin
package hu.bme.aut.android.workplaceapp.data

data class Person(
    val name: String,
    val email: String,
    val address: String,
    val id: String,
    val socialSecurityNumber: String,
    val taxId: String,
    val registrationId: String
)
```

To access the instance of the *Person* class, let's create a `DataManager` class (also inside the `data` *package*). This will simulate real data access (we use the Singleton pattern to make it easily accessible from all parts of the application, using the object keyword provided by Kotlin):

```kotlin
package hu.bme.aut.android.workplaceapp.data

object DataManager {
    val person = Person(
        "Test User", "testuser@domain.com",
        "1234 Test, Random Street 1.",
        "123456AB",
        "123456789",
        "1234567890",
        "0123456789"
    )
}
```

On the profile page, our goal is to display the normal and detailed data in two separate sections. You can move between the two pages with a horizontal swipe. For this, we will use a **HorizontalPager**, which can implement such interactions between Composable functions.

First, let's create a helper *Composable* called `InfoField` in the `hu.bme.aut.android.workplaceapp.ui.view` *package*, which will help display the data:

```kotlin
package hu.bme.aut.android.workplaceapp.ui.view

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun InfoField(title: String, value: String) {
    Column(
        modifier = Modifier.padding(bottom = 16.dp)
    ) {
        Text(
            color = Color.Gray,
            text = title,
            fontSize = 20.sp
        )
        Text(
            text = value,
            fontSize = 24.sp
        )
    }
}

@Preview
@Composable
fun PreviewInfoField() {
    InfoField(title = "Name", value = "Test User")
}
```

After that, let's create our two profile pages. We create the following files in the `hu.bme.aut.android.workplaceapp.feature.profile` *package*:

`ProfileFirstPage`

```kotlin
package hu.bme.aut.android.workplaceapp.feature.profile

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import hu.bme.aut.android.workplaceapp.ui.view.InfoField

@Composable
fun ProfileFirstPage(
    name: String,
    email: String,
    address: String
) {
    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxSize()
    ) {
        InfoField(title = "NAME:", value = name)
        InfoField(title = "EMAIL:", value = email)
        InfoField(title = "ADDRESS:", value = address)
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewProfileFirstPage() {
    ProfileFirstPage(
        name = "Test User",
        email = "test@email",
        address = "Test Street"
    )
}
```

This *Composable* function will be responsible for the first page, and the next one for the second page.

`ProfileSecondPage`

```kotlin
package hu.bme.aut.android.workplaceapp.feature.profile

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import hu.bme.aut.android.workplaceapp.ui.view.InfoField

@Composable
fun ProfileSecondPage(
    id: String,
    socialSecurityId: String,
    taxId: String,
    registrationId: String
) {
    Column(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxSize()
    ) {
        InfoField(title = "ID:", value = id)
        InfoField(title = "SOCIAL SECURITY ID:", value = socialSecurityId)
        InfoField(title = "TAX ID:", value = taxId)
        InfoField(title = "REGISTRATION ID:", value = registrationId)
    }
}

@Preview(showBackground = true)
@Composable
fun PreviewProfileSecondPage() {
    ProfileSecondPage(
        id = "123456",
        socialSecurityId = "A89FSE568TZ",
        taxId = "GO894GE56",
        registrationId = "R6879SDLTH"
    )
}
```

The parameters of the function will be the profile data in String format.

Once we have these, let's create our *Composable* function called `ProfileScreen` as follows:

```kotlin
package hu.bme.aut.android.workplaceapp.feature.profile

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import hu.bme.aut.android.workplaceapp.R
import hu.bme.aut.android.workplaceapp.data.DataManager
import hu.bme.aut.android.workplaceapp.ui.view.TopBar

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun ProfileScreen(
    modifier: Modifier = Modifier
) {
    Scaffold(
        topBar = {
            TopBar(stringResource(id = R.string.profile))
        }
    ) { innerPadding ->
        val pagerState = rememberPagerState(pageCount = { 2 })
        val profile = DataManager.person
        
        HorizontalPager(
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize(),
            state = pagerState
        ) {

            when (it) {
                0 -> {
                    ProfileFirstPage(
                        name = profile.name,
                        email = profile.email,
                        address = profile.address
                    )
                }

                1 -> {
                    ProfileSecondPage(
                        id = profile.id,
                        socialSecurityId = profile.socialSecurityNumber,
                        taxId = profile.taxId,
                        registrationId = profile.registrationId
                    )
                }
            }
        }
    }
}

@Composable
@Preview
fun PreviewProfileScreen() {
    ProfileScreen()
}
```

Here we first need to create a variable called `pagerState`, which we will pass to `HorizontalPager`. This contains how many pages there will be on the given *Composable*. After that, we will need a profile, which we have previously defined as an `object`. Finally, we will use `HorizontalPager` to create the pageable page, on which we will place the two *Composable* functions 1-1 as pages. And we will select the current page using `it`.

Finally, we will connect `ProfileScreen` to the navigation:

```kotlin
package hu.bme.aut.android.workplaceapp.navigation

sealed class Screen(val route: String) {
    object Menu : Screen("menu")
    object Profile: Screen("profile")
}
```

```kotlin
package hu.bme.aut.android.workplaceapp.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import hu.bme.aut.android.workplaceapp.feature.menu.MenuScreen
import hu.bme.aut.android.workplaceapp.feature.profile.ProfileScreen

@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Menu.route
    ) {
        composable("menu") {
            MenuScreen(
                onProfileButtonClick = { navController.navigate(Screen.Profile.route) },
                onHolidayButtonClick = {},
                onSalaryButtonClick = {},
                onCafeteriaButtonClick = {})
        }
        composable(Screen.Profile.route) {
            ProfileScreen()
        }
    }
}
```

Let's try the application! Clicking on the Profile button will display the user's data, and you can also scroll through it.

!!!example "TO BE SUBMITTED (1 point)"
    Make a **screenshot** showing the **profile page** (on an emulator, mirroring the device or with a screen capture), in which one of the fields is replaced by your **neptun code**, and the **HorizontalPager** code snippet! Upload the image to the repository in the solution as f2.png!

    The screenshot is a necessary condition for obtaining a score.


## Create a Leave Screen (1 point)

On the Leave screen, we will display a pie chart that shows the percentage of leave taken and the remaining leave. In addition, we will allow the user to select a new leave interval using a button on the interface.

!!!note "PieChart"
    Previously, we used the [MPAndroidChart](https://github.com/PhilJay/MPAndroidChart) library in the View framework to draw the PieChart, but unfortunately this does not work for *Jetpack Compose*.

We will use the [YCharts](https://github.com/codeandtheory/YCharts) library to draw the chart. To do this, first add the dependency:

Open the `settings.gradle.kts` file and add the following to the `repositories` tag:

```groovy
repositories {
    ...
    maven { url = uri("https://jitpack.io")}
}
```

This means that we can also pull in dependencies from the [jitpack](https://jitpack.io/) repository.

Then, like the previous dependencies, let's add *YCharts*:

`libs.versions.toml`:

```toml
[versions]
...
ycharts = "2.1.0"

[libraries]
...
ycharts = { module = "co.yml:ycharts", version.ref = "ycharts" }
```

`build.gradle.kts` (modul szintű):

```groovy
dependencies {
    ...
    implementation(libs.ycharts)
}
```

Also, within this file, find the `minSdk` variable and change it to 26, as this is required to use *YCharts*:

```groovy
android {
    ...
    defaultConfig{
        ...
        minSdk = 26
        ...
    }
    ...
}
```

Then Sync the Project with the `Sync Now` button on the top right.

Once the files are downloaded, create our `HolidayScreen` *Composable* function in the `hu.bme.aut.android.workplaceapp.feature.holiday` *package* as follows:

```kotlin
package hu.bme.aut.android.workplaceapp.feature.holiday

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import hu.bme.aut.android.workplaceapp.ui.view.TopBar

@Composable
fun HolidayScreen(
    modifier: Modifier = Modifier
) {
    var showDialog by remember { mutableStateOf(false) }

    Scaffold (
        topBar = {
            TopBar("Holiday")
        }
    ) { innerPadding ->

        Column(
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {

            //Creating PieChartData
            //...

            //Creating PieChartConfig
            //...

            //Creating PieChart - using PieChartData, PieChartConfig
            //...

            //Holiday Button
            //...

            //DatePicker Dialog
            //...

        }
    }

}

@Composable
@Preview
fun PreviewHolidayScreen() {
    HolidayScreen()
}
```

Then, fill the interface with content:

1. Create our `pieChardData` variable as follows (Copy it under the `//Create PieChartData` comment):
```kotlin
val pieChartData = PieChartData(
    slices = listOf(
        PieChartData.Slice("Remaining", 5f, Color(0xFFFFEB3B)),
        PieChartData.Slice("Taken", 15f, Color(0xFF00FF00)),
    ), plotType = PlotType.Pie
)
```
    * We can pass two parameters to `PieChartData`:
        - **slices**: This parameter will contain the data, the distribution of the data, and the color of the data.
        - **plotType**: We can use this variable to specify the type of the chart. In this case, it will be `Pie` type.
    * We can pass four parameters to `PieChartData.Slice`, we will only deal with the first three:
        - **label**: This String will appear on each "slice".
        - **value**: This is the distribution value of the data
        - **color**: This allows us to set the color of each data in the chart.

    We have passed the value of the distribution to our two variables stored in the ViewModel. This will change every time we submit a new leave time slot, and it will still retain its value if we exit the Leave screen to the main menu and back.

2.  Similarly to the previous example, we also create the `pieChartConfig` variable:
```kotlin
val pieChartConfig = PieChartConfig(
    backgroundColor = Color.Transparent,
    labelType = PieChartConfig.LabelType.VALUE,
    isAnimationEnable = true,
    labelVisible = true,
    sliceLabelTextSize = TextUnit(20f, TextUnitType.Sp),
    animationDuration = 1000,
    sliceLabelTextColor = Color.Black,
    inActiveSliceAlpha = .8f,
    activeSliceAlpha = 1.0f,
)
```
    * `PieChartConfig` has a lot of parameters, we will only look at a few of them during the lab.
        - **backgroundColor**: This allows us to change the background of the diagram. In this case, we need transparent.
        - **labelType**: This allows us to set whether the value or percentage is displayed on each slice of the diagram, but this does not currently work :)
        - **isAnimationEnable**: Turns animation on and off.
        - **labelVisible**: This allows us to turn the label visible on the slices of the diagram.
        - **sliceLabelTextSize**: Size of the label on the slices.
        - **animationDuration**: Duration of the animation.
        - **sliceLabelTextColor**: Color of the label.
        - **inActiveSliceAlpha**: Transparency of inactive slices.
        - **activeSliceAlpha**: Transparency of active slices.

3. Creating `PieChart`:
```kotlin
PieChart(
    modifier = Modifier
        .width(400.dp)
        .height(400.dp),
    pieChartData,
    pieChartConfig
)
```
    * We pass the two variables we created earlier to the `PieChart` *Composable* function, and it uses them to create the pie chart.

Finally, we also connect `HolidayScreen` to the navigation:

```kotlin
package hu.bme.aut.android.workplaceapp.navigation

sealed class Screen(val route: String) {
    object Menu : Screen("menu")
    object Profile: Screen("profile")
    object Holiday: Screen("holiday")
}
```

```kotlin
package hu.bme.aut.android.workplaceapp.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import hu.bme.aut.android.workplaceapp.feature.holiday.HolidayScreen
import hu.bme.aut.android.workplaceapp.feature.holiday.HolidayViewModel
import hu.bme.aut.android.workplaceapp.feature.menu.MenuScreen
import hu.bme.aut.android.workplaceapp.feature.profile.ProfileScreen

@Composable
fun NavGraph(
    navController: NavHostController = rememberNavController(),
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Menu.route
    ) {
        composable("menu") {
            MenuScreen(
                onProfileButtonClick = { navController.navigate(Screen.Profile.route) },
                onHolidayButtonClick = { navController.navigate(Screen.Holiday.route) },
                onSalaryButtonClick = {},
                onCafeteriaButtonClick = {})
        }
        composable(Screen.Profile.route) {
            ProfileScreen()
        }
        composable(Screen.Holiday.route) {
            HolidayScreen()
        }
    }
}
```


So that if we start the application now, we can already see the diagram for the Holiday option, but we can't change it yet.

!!!example "BEADANDÓ (1 point)"
    Create a **screenshot** showing the **holiday screen** (on an emulator, by mirroring the device or by taking a screenshot), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f3.png!

    The screenshot is a necessary condition for getting a score.

## Implementing a date picker (1 point)

The next step is to implement the `Take Holiday` button:
    * For this, we will need a `DialogWindow` in step 4, but in the meantime we can set the Button's behavior. When we press the button, we set the variable indicating the dialog display to true:

```kotlin
Button(
    onClick = { showDialog = true }
) {
    Text("Take holiday")
}
```

### Maintaining state between screens using ViewModel

To avoid losing track of holidays when navigating between screens (and for architectural reasons), we cannot store this state in *screens*.
Create a new *Kotlin File* called `HolidayViewModel` in the `holiday` *package*. This is where we will store the maximum number of holidays and the number of holidays already taken. (Of course, in a real application, this data would come from some kind of backend or network, and the *viewmodel* would get it from there.)

The code for `HolidayViewModel` is:

```kotlin
package hu.bme.aut.android.workplaceapp.feature.holiday

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class HolidayViewModel : ViewModel() {
    private val _holidayMaxValue = MutableStateFlow(20)
    val maxHolidayValue: StateFlow<Int> = _holidayMaxValue

    private val _takenHolidayValue = MutableStateFlow(15)
    val takenHolidayValue: StateFlow<Int> = _takenHolidayValue

    fun takeHoliday(days: Int) {
        viewModelScope.launch {
            _takenHolidayValue.value += days
        }
    }
}
```

!!!warning "ViewModel"
    We will see examples of "prettier" and more complex uses of the viewmodel in later labs.

Next, let's modify the `HolidayScreen` header to take *viewmodel*.t, and then get the appropriate properties from them:

```kotlin
package hu.bme.aut.android.workplaceapp.feature.holiday

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.TextUnitType
import androidx.compose.ui.unit.dp
import co.yml.charts.common.model.PlotType
import co.yml.charts.ui.piechart.charts.PieChart
import co.yml.charts.ui.piechart.models.PieChartConfig
import co.yml.charts.ui.piechart.models.PieChartData
import hu.bme.aut.android.workplaceapp.ui.view.TopBar
import androidx.lifecycle.viewmodel.compose.viewModel
import java.util.Calendar

@Composable
fun HolidayScreen(
    modifier: Modifier = Modifier,
    viewModel: HolidayViewModel = viewModel()
) {

    val maxHolidayValueVM by viewModel.maxHolidayValue.collectAsState()
    val takenHolidayValueVM by viewModel.takenHolidayValue.collectAsState()
    val remainingHolidaysVM = maxHolidayValueVM - takenHolidayValueVM

    val currentDate = Calendar.getInstance()
    val context = LocalContext.current

    var showDialog by remember { mutableStateOf(false) }

    Scaffold (
        topBar = {
            TopBar("Holiday")
        }
    ) { innerPadding ->

        Column(
            modifier = modifier
                .padding(innerPadding)
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {

            //Creating PieChartData 
            val pieChartData = PieChartData(
                slices = listOf(
                    PieChartData.Slice("Remaining", remainingHolidaysVM.toFloat(), Color(0xFFFFEB3B)),
                    PieChartData.Slice("Taken", takenHolidayValueVM.toFloat(), Color(0xFF00FF00)),
                ), plotType = PlotType.Pie
            )

            //Creating PieChartConfig 
            val pieChartConfig = PieChartConfig(
                backgroundColor = Color.Transparent,
                labelType = PieChartConfig.LabelType.VALUE,
                isAnimationEnable = true,
                labelVisible = true,
                sliceLabelTextSize = TextUnit(20f, TextUnitType.Sp),
                animationDuration = 1000,
                sliceLabelTextColor = Color.Black,
                inActiveSliceAlpha = .8f,
                activeSliceAlpha = 1.0f,
            )

            //Creating a PieChart - using PieChartData, PieChartConfig
            PieChart(
                modifier = Modifier
                    .width(400.dp)
                    .height(400.dp),
                pieChartData,
                pieChartConfig
            )

            //Holiday Button
            Button(
                onClick = { showDialog = true }
            ) {
                Text("Take holiday")
            }

            //DatePicker Dialog
            //...

        }
    }

}

@Composable
@Preview
fun PreviewHolidayScreen() {
    HolidayScreen()
}
```
!!!danger "pieChartData"
    Make sure to update `pieChartData` as well, as we are no longer using a baked distribution value here, but a variable in the viewModel!

!!!warning "viewModel"
    Often Android Studio cannot find the import required for `viewModel()`. In this case, we manually write the following import for the imports:
    ```kotlin
    import androidx.lifecycle.viewmodel.compose.viewModel
    ```

After that, we create the dialog window as follows:

```kotlin
//DatePicker Dialog
if (showDialog) {
    DatePickerDialog(
        context,
        { _, _year, _months, _days ->
            showDialog = false
            val selectedDate = Calendar.getInstance().apply{
                set(_year, _months, _days)
            }
            val diff = ((selectedDate.timeInMillis - currentDate.timeInMillis) / (24 * 60 * 60 * 1000)).toInt()
            viewModel.takeHoliday(
                days = diff
            )
        },
        currentDate.get(Calendar.YEAR), currentDate.get(Calendar.MONTH), currentDate.get(Calendar.DAY_OF_MONTH)
    ).apply {
        setOnCancelListener { showDialog = false }
        show()
    }
}
```

We use the DataPicker Dialog in a similar way to what we saw in previous labs. We pass it a context, then a lambda parameter that will describe the behavior if we select a date, and finally we pass the current date as the last three parameters.

!!!tip "DatePickerDialog import"
    For `DatePickerDialog` we use the following import:
    ```kotlin
    import android.app.DatePickerDialog
    ```

Once we have that, we just need to modify `NavGraph` so that the values ​​are retained by the application when we exit and enter the Holiday screen. We can do this as follows:

```kotlin
package hu.bme.aut.android.workplaceapp.navigation

sealed class Screen(val route: String) {
    object Menu : Screen("menu")
    object Profile: Screen("profile")
    object Holiday: Screen("holiday")
}
```

```kotlin
@Composable
fun NavGraph(
    ...
){
    val holidayViewModel: HolidayViewModel = viewModel()

    NavHost(
        ...
    ){
        ...
        composable(Screen.Holiday.route) {
            HolidayScreen(viewModel = holidayViewModel)
        }

    }
}
```

Then, when you start the application, our `Take Holiday` button will work.

!!!example "TO BE SUBMITTED (1 point)"
    Make a **screenshot** showing the **date selection image** (on an emulator, mirroring the device or with a screenshot), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f4a.png! **In addition**, make a **screenshot** showing the **date selection result on the holiday screen** (on an emulator, mirroring the device or with a screenshot), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f4b.png!

    The screenshot is a necessary condition for obtaining a score.


## Independent task (1 point)

* Only allow taking a new holiday if the selected day is later than today. (0.5 points)
* If our holiday frame is exhausted, the Take Holiday button should be disabled. (0.5 points)

!!!example "TO BE SUBMITTED (0.5 points)"
    Create a **screenshot** showing the **date selection page** (on emulator, device mirroring or screen capture), the **code snippet for disabling earlier days**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f5a.png!

    The screenshot is a necessary condition for getting a score.

!!!example "TO BE SUBMITTED (0.5 points)"
    Create a **screenshot** showing the **disabled button** (on an emulator, by mirroring the device or by taking a screenshot), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f5b.png!

    The screenshot is a necessary condition for obtaining a score.

## iMSc task (2 points)

### Payment menu item implementation

Clicking on the Payment menu item should display a `PaymentScreen` with a HorizontalPager and two screens (similar to the Profile menu item):
- `PaymentTaxesScreen`: a pie chart with the current payment written in the middle and showing the net income and taxes deducted (separately for each tax)
- `MonthlyPaymentScreen`: show a bar chart with 12 columns, showing payments broken down by month - it is worth storing the data in the DataManager class here too

[Help](https://github.com/codeandtheory/YCharts)

!!!example "TO BE SUBMITTED (1 iMSc point)"
    Create a **screenshot** showing the **current payment and net income with taxes deducted** (on an emulator, by mirroring the device or by taking a screenshot), a **corresponding code snippet**, and your **neptune code somewhere in the code as a comment**! Upload the image to the repository in the solution as f6.png!

    The screenshot is a required condition for obtaining a score.

!!!example "TO BE SUBMITTED (1 iMSc point)"
    Create a **screenshot** showing the **12 columns with monthly payment data** (on an emulator, mirroring the device or with a screenshot), a **corresponding code fragment**, and your **neptune code somewhere in the code as a comment**! Upload the image to the repository in the solution as f7.png!

    The screenshot is a required condition for obtaining a score.

## Extra task

For those interested, there is an extra task in this lab, but it is only for gaining your own experience. **No points for this task!**

* Similar to the standalone task, now set the DatePicker dialog box to only allow you to choose between today or today + maximum days off.

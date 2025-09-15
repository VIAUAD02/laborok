# Labor 02 - UI - Public Transportation Application

## Introduction

During the lab, we will create a skeleton of an application for a public transportation company. The application will allow users to purchase passes for different vehicles. For now, we will only simulate the business logic (authentication, verification of entered data, payment processing), the focus of the lab will be on creating the interfaces and navigation between them.

<p align="center">
<img src="./assets/splash.png" width="19%">
<img src="./assets/login.png" width="19%">
<img src="./assets/list.png" width="19%">
<img src="./assets/details.png" width="19%">
<img src="./assets/pass.png" width="19%">
</p>

!!! warning "IMSc"
	After successfully completing the lab tasks, 2 IMSc points can be earned by solving the IMSc task.

## Preparations

When solving the tasks, don't forget to follow the [task submission process](../github/GitHub.md).

### Create and download a Git repository

1. In Moodle, find the lab invitation URL and use it to create your own repository.

1. Wait for the repository to be ready, then checkout it.

    !!! tip ""
        In university labs, if the system does not prompt for a username and password during checkout and the checkout fails, it is likely that the system tried to use a username previously saved on the machine. First, delete the saved login information and try again.

1. Create a new branch called `solution` and work on this branch.

1. Write your Neptun code in the file `neptun.txt`. The file should contain nothing else but the 6 characters of the Neptun code on a single line.


!!! info "Android, Java, Kotlin"
	Android was traditionally developed in Java, but in recent years Google has switched to [Kotlin](https://kotlinlang.org/). This is a much more modern language than Java, providing many language elements that are convenient to use, as well as new language rules that, for example, can be used to avoid `NullPointerException`-type errors that are common in Java.

    On the other hand, the language differs in many ways from languages ​​that traditionally follow a C-like syntax, as we will see. Before the lab, it is worth familiarizing yourself with the language, firstly by using the link above, and secondly by reading [this](https://developer.android.com/kotlin/learn) the summary article.

## Create the project

First, let's start Android Studio, then:

1. Create a new project, select *Empty Activity*.
2. The project name should be `PublicTransport`, the starting package `hu.bme.aut.android.publictransport`, and the save location should be the PublicTransport folder within the checked-out repository.
3. Select *Kotlin* as the language.
4. The minimum API level should be API24: Android 7.0.
5. The *Build configuration language* should be Kotlin DSL.

!!!danger "FILE PATH"
	The project should be placed in the PublicTransport directory in the repository and pushed when submitted! Without the code, we cannot give the lab maximum points!

!!!info ""
	When creating a project, the compiler framework needs to download a lot of dependencies. Until this has happened, the project is difficult to navigate, code completion is missing, etc... That's why it's advisable to wait for this, but it can take up to 5 minutes the first time! You should pay attention to the information bar at the bottom of the window.

We can see that a project has been created, with an Activity called `MainActivity`. This has also been automatically written into the *Manifest* file as an Activity component.

The next step is to add the necessary dependencies to the project! To do this, open the

- Module-level `build.gradle.kts` file (*app -> build.gradle.kts*)
- Or the `libs.version.toml` file (*gradle -> libs.versions.toml*)

First, copy the following dependencies into the `libs.version.toml` version catalog file:

```toml
[versions]
agp = "8.12.3"
kotlin = "2.2.20"
coreKtx = "1.17.0"
junit = "4.13.2"
junitVersion = "1.3.0"
espressoCore = "3.7.0"
lifecycleRuntimeKtx = "2.9.3"
activityCompose = "1.12.0-alpha08"
composeBom = "2025.09.00"

coreSplashscreen = "1.0.1"
nav3Core = "1.0.0-alpha09"
kotlinSerialization = "2.2.20"
kotlinxSerializationCore = "1.9.0"

[libraries]
...
androidx-core-splashscreen = { module = "androidx.core:core-splashscreen", version.ref = "coreSplashscreen" }
androidx-navigation3-runtime = { module = "androidx.navigation3:navigation3-runtime", version.ref = "nav3Core" }
androidx-navigation3-ui = { module = "androidx.navigation3:navigation3-ui", version.ref = "nav3Core" }
kotlinx-serialization-core = { module = "org.jetbrains.kotlinx:kotlinx-serialization-core", version.ref = "kotlinxSerializationCore" }

[plugins]


jetbrains-kotlin-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlinSerialization"}
```

Here, inside the `[versions]` tag, we can give a variable name and then a version value, which we will pass to `version.ref` in the next step. This tells us which version of the given module is being used. Inside the `[libraries]` tag, we also define a variable called `androidx-navigation-compose`, which we will use later in the `build.gradle.kts` file. We give it which module we want to include in the project, as well as a version number that we have previously defined.

Once we are done with this, let's open the `build.gradle.kts` file and add the modules we just added inside the `dependencies` tag:

```kts
dependencies {
    ...
    implementation(libs.androidx.core.splashscreen)
    implementation(libs.androidx.navigation3.ui)
    implementation(libs.androidx.navigation3.runtime)
    implementation(libs.kotlinx.serialization.core)
}
```

Here we can add a new dependency to the project using the `implementation` function, and within this we need to specify the name of the module, which we have previously defined in `libs.version.toml`. We can do this as follows:

- specify the name of the file, in this case `libs`
- then specify the name of the variable to which we previously assigned our module.

Finally, enable the following `plugin` at the top of the `build.gradle.kts` file:

```kotlin
plugins {
	...
    alias(libs.plugins.jetbrains.kotlin.serialization)
}
```


Once we are done with this, click the `Sync Now` button in the upper right corner and wait for it to download the necessary dependencies.

!!!danger "Sync Now"
    Warning: if we skip this step, Android Studio will not find the necessary elements, and this may cause problems later!


## Splash screen (0.5 points)

After the user launches the application, we want to greet them with a "welcome/splash" screen. This is an elegant solution to not have a solid color screen in front of the user until the application loads, but in this case an application logo with an arbitrary background color.

<p align="center">
<img src="./assets/splash.png" width="320">
</p>

???info "Splash scheen below Android 12 (API 31)"

    (The required file is available [here](./downloads/res.zip))

    Create a new XML file in the `drawable` folder called `splash_background.xml`. This will be the graphic that appears on our splash screen. Its content should be as follows:
	
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
	
	In this case, we'll put a single image here, but we could also do more complex things by adding additional `items`. A typical solution is to set a solid background with the application icon on it.

    Open the `values/themes.xml` file. This defines the different themes used in the application. We'll create a new theme for the splash screen, in which we'll set the drawable we created earlier as the background of our application window (since this is what's actually visible until the rest of the UI has loaded). We can do this like this:
	
	```xml
	<style name="SplashTheme" parent="Theme.AppCompat.NoActionBar">
	    <item name="android:windowBackground">@drawable/splash_background</item>
	</style>
	```
	
    We will also include the above theme in the `themes.xml` file with the `night` qualifier.

    To use the theme, we need to modify our application's manifest file (`AndroidManifest.xml`). Opening it, we can see that the entire application is currently using the theme named `AppTheme`.
	
	```xml
	<application
	    ...
	    android:theme="@style/Theme.PublicTransport" >
	```
	
    We don't want to change this, we just want to give `LoginActivity` a new theme. We can do this like this:
	
	```xml
	<activity
	    android:name=".LoginActivity"
	    android:theme="@style/SplashTheme">
	    ...
	</activity>
	```
	
	Since we won't need this background after loading, we can restore the original theme, which has a white background, in the `LoginActivity.kt` file after loading is complete. Do this at the beginning of the `onCreate` function, before the `super` call:
	
	```kotlin
	override fun onCreate(savedInstanceState: Bundle?) {
	    setTheme(R.style.Theme_PublicTransport)
	    ...
	}
	```
		
	Now we can run the application and we should see the embedded image as it loads. A splash screen is usually useful when the application takes a long time to initialize. Since our current application still starts very quickly, we can simulate a small loading time as follows:
	
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


Above API 31, a [Splash Screen API](https://developer.android.com/develop/ui/views/launch/splash-screen) was introduced, now we will use it. For this, we have already added the necessary dependency to the `build.gradle.kts` file.

Let's create an arbitrary icon, which we will use in the middle of our splash screen. For this, we will use the built-in `Asset Studio` tool of Android Studio. On the left side, under the *Project* tab, open the `Resource Manager`, then press the <kbd>+</kbd> button, and there select the `Image Asset` option.

1. Here we want to generate a *Launcher Icon*, so let's select it.
2. Let's name it *ic_transport*
3. For the sake of simplicity, we will now create our icon from *Clip Art*, so let's select it, then choose a nice one from the button below it (e.g. with the search word *bus*).
4. After that, choose a nice color.
5. If we want, we can also adjust the size.
6. We can also adjust the background color on the `Background Layer` tab.
7. In the settings, change the icon to be created in *PNG* format.
8. Then press the *Next* and then the *Finish* button.

<p align="center"> 
<img src="./assets/asset_studio.png">
</p>

We can see that several types of icons have been created, in several sizes. The system will choose from these depending on the configuration.

To create the splash screen, we need to define a new style in the `themes.xml` file. Add the following code snippet under the existing style. (We will deal with very little XML code within the scope of this subject.)

```xml
<style name="Theme.PublicTransport.Starting" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">#5A3DDC</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/ic_transport_foreground</item>
    <item name="android:windowSplashScreenIconBackgroundColor">#5A3DDC</item>
    <item name="postSplashScreenTheme">@style/Theme.PublicTransport</item>
</style>
```

Our new style is called `Theme.PublicTransport.Starting` and is derived from the `Theme.SplashScreen` theme. In addition, we set it to

- `windowSplashScreenBackground`: the background of the splash screen (of course, you can choose a different one),
- `windowSplashScreenAnimatedIcon`: the icon in the middle should be our own icon, and it is only its foreground,
- `android:windowSplashScreenIconBackgroundColor`: what background should be behind our icon (this can also be customized with a different color),
- `postSplashScreenTheme`: what style the application should switch back to after the splash screen.


!!!note
	The Splash Screen API can do much more than that, we can even animate the displayed image, but unfortunately this is beyond the scope of this lab.

Now that we have configured our *splash* screen, we just need to configure its use. To do this, we first need to apply the style we just created to `MainActivity` in `AndroidManifest.xml`.


```xml
<activity
    android:theme="@style/Theme.PublicTransport.Starting"
    android:name=".MainActivity"
    android:exported="true">
    ...
</activity>
```

Then let's set the icon for our application:

```xml
<application
    ...
    android:icon="@mipmap/ic_transport"
    android:roundIcon="@mipmap/ic_transport_round">
    ...
</application>
```


!!!note "Splash Screen with navigation"
    The Splash Screen can also be solved using navigation, a tutorial [task](#extra-task-navigation-splash) will help you with this at the end of the lab. (This is not required to pass the lab, you can get the maximum score without the task, but it is worth doing it for the sake of interest.)


Let's try our app!

!!!example "TO BE SUBMITTED (0.5 points)"
	Take a **screenshot** of the **splash screen** (on an emulator, mirroring your device, or by taking a screenshot), a **corresponding code snippet**, and your **Neptune code somewhere in the code as a comment**! Upload the image to the repository in the solution as f1.png!

    The screenshot is a required condition for getting a score!


## Login screen (0.5 points)

Now we can create the login screen. We will ask the user for an email address and a numeric password, and for now we will only check if they have entered anything in the field.

<p align="center"> 
<img src="./assets/login.png" width="320">
</p>


### UI

First, let's create a new *Package* called `screen` in the project folder, and then within that, create a new *Kotlin File* called `LoginScreen`. This screen will contain the necessary labels, buttons, and input fields. To do this, we use the following code:

```kotlin
@Composable
fun LoginScreen(
    onSuccess: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        //TODO Logo

        //TODO Header Text
        

        //TODO Email Field
        

        //TODO Password Field
        

        //TODO Login Button
        
    }
}


private fun isEmailValid(email: String) = email.isEmpty()

private fun isPasswordValid(password: String) = password.isEmpty()

@Preview
@Composable
fun PreviewLoginScreen() {
    LoginScreen(onSuccess = {})
}
```

So once we have the `LoginScreen` framework, let's start packing in the individual elements. (Image, Text, TextField, Button)

Let's start with the `Image` *Composable*. For simplicity, we'll put the app icon at the top of the login screen as a design element.

```kotlin
//Logo
Image(
    painter = painterResource(id = R.mipmap.ic_transport_round),
	contentDescription = "Logo",
    modifier = Modifier.size(160.dp)
)
```

Since the `Image` *Composable* only accepts vector resources, we will initially get an error. The easiest way to fix this is to delete the *xml* versions of the *ic_transport* and *ic_transport_round* resources and leave only the *png* ones. From here, after building the application, a preview of our interface will also appear.

Let's continue with the `Text` *Composable*. This will serve as a message at the top of the form with the text `"Please enter your credentials!"`.

```kotlin
//Header Text
Text(
    modifier = Modifier.padding(16.dp),
    text = "Please enter your credentials!"
)
```

Next, we create the two `TextField`s`, which we will implement using an `OutlinedTextField` *Composable*. We will also need other variables here.

**Email Field**

```kotlin
//Email Field
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
        emailError = isEmailValid(email)
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
            Text("Please enter your e-mail address!", color = Color.Red)
        }
    }

)
```

**Password Field**

```kotlin
//Password Field
var password by remember { mutableStateOf("") }
var passwordError by remember { mutableStateOf(false) }

OutlinedTextField(
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp),
    label = { Text("Password") },
    value = password,
    onValueChange =
    {
        password = it
        passwordError = isPasswordValid(it)
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
            Text("Please enter your password!", color = Color.Red)
        }
    }
)
```

The parameters used for `OutlinedTextField` above are:

1. **label**: With this we can specify the caption that will appear in the empty TextField. So that if we have already written in it, then thanks to `OutlinedTextField` the text *Label* will slide up to the upper left corner.
2. **value**: We pass the entered value to this parameter.
3. **onValueChange**: This is a lambda, with which we can repeatedly assign a value to the variable that we passed to the **value** parameter. With each change, this parameter is updated thanks to `remember`.
4. **visualTransformation**: With this we can change whether it is a *Password* or a plain Input field.
5. **keyboardOptions**: With this parameter we can set and limit what data the user can enter in the input field.
6. **isError**: We also pass a variable to this, which is updated each time if the input field is empty. This will be useful, because in the task we want the TextField to print a message if we want to log in empty.
7. **trailingIcon**: Here we can set the Icon that we want to see on the right side of the TextField.
8. **supportingText**: This parameter is responsible for being able to display text under the TextField.

Finally, let's make the last element, which will be the button that will be responsible for logging in.

```kotlin
//Login Button
Button(
    onClick = {
        if (isEmailValid(email)) {
            emailError = true
        } else if (isPasswordValid(password)) {
            passwordError = true
        } else {
            onSuccess()
        }
    },
    modifier = Modifier
        .fillMaxWidth()
        .padding(8.dp)
) {
    Text("Login")
}
```

!!!danger "using string resources"
	It is worth outsourcing the Strings to the `./values/strings.xml` file, so we can [localize](https://developer.android.com/guide/topics/resources/localization) our application using `resource qualifiers`. We can do this using the <kbd>ALT</kbd> + <kbd>ENTER</kbd> key combination, by clicking on the string, or by manually adding it to `strings.xml`
    ```xml
    <string name="label_email">Email</string>
    ```

!!!warning "code interpretation"
    Let's talk through and interpret the code with the help of the lab leader!


### Navigation

To display our new interface, it would be enough to simply call the `LoginScreen` function in the `onCreate` function of `MainActivity`. However, it would be better if we start preparing the application navigation now. To do this, first create a new *Package* in the project folder called `navigation`, and then create two *Kotlin Files* in it (right click on our *Package* -> New -> Kotlin Class/File) called `AppNavigation` and `Screen`. The latter will only be needed so that we can solve the navigation between the screens in a better way later. We will describe this in detail in the [Extra task - More transparent navigation](#extra-task-more-transparent-navigation) section for those interested.



Open the `AppNavigation` file, create the following code, and then review and interpret it with the help of the lab leader!

```kotlin
data object LoginScreenDestination

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = remember { mutableStateListOf<Any>(LoginScreenDestination) }

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = { key ->
            when (key) {
                is LoginScreenDestination -> NavEntry(key) {
                    LoginScreen(onSuccess = {})
                }

                else -> {
                    error("Unknown route: $key")
                }
            }
        }
    )
}
```

Here we first create a singleton data class (`data object`) called `LoginScreenDestination`. This represents one of the "stations" of our navigation.

In our `AppNavigation` function, we first create a `backStack`, which will contain our navigation destinations. You can see that anything can be put into this list, we currently put our only existing destination, `LoginScreenDestination`. After that, we set the `NavDisplay` function parameters as:

* the **modifier** decorator,
* the **backstack** we just created
* the **behavior that should be executed when the back button is pressed** (in this case, remove the top element of the *backstack*),
* and the navigation logic itself, where depending on which "station" we are on, we display something (in this case, in the case of `LoginScreenDestination`, `LoginScreen`.


There is only one more step to see this screen on the emulator after launch. Open the `MainActivity` file and modify it as follows:


```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PublicTransportTheme {
                AppNavigation(modifier = Modifier.safeDrawingPadding())
            }
        }
    }
}
```

!!!note "EdgeToEdge"
	Starting with Android 15 (API 35), our application can draw under the system UI (StatusBar, NavigationBar, soft keyboard, etc.). This allows us to use the entire screen of the device from edge to edge. This can be useful in countless cases when we want to write a "full-screen" application, without being limited by the overlapping system UI. The function is of course also available at lower API levels, for which the `enableEdgeToEdge` function call shown above is for.

    However, as useful as this is, it can also cause many problems if, for example, some of our controls slide under the software keyboard, which we cannot reach. [insets](https://developer.android.com/develop/ui/compose/layouts/insets) were invented to eliminate this. It has several settings that save us from having to manually guess how many dp the *status bar* is, especially since these values ​​can change at runtime (see software keyboard). Among the many settings, we are now using the `safeDrawindPadding` shown above, which, as the name suggests, sets just enough *padding* everywhere so that nothing is covered by the system UI. (Of course, this can be used not only in `Activity`, but also on all `Screen` and `Composable`.)

    A good demonstration of this feature is that the LoginScreen controls, which are placed in the middle of the entire page, are not covered when the software keyboard appears, but slide into the middle of the free space.

	<p align="center"> 
	<img src="./assets/login.png" width="160">
	<img src="./assets/login_insets.png" width="160">
	</p>

!!!example "TO BE SUBMITTED (0.5 points)"
	Take a **screenshot** of the **login screen with an input error** (on an emulator, mirroring your device, or by taking a screenshot), a **corresponding code snippet**, and your **Neptun code typed into the email field**! Upload the image to the repository in the solution as f2.png!

    The screenshot is a required condition for getting a score!

## List of options (1 point)

On the next screen, the user can choose from different types of vehicles. For now, only three services operate in our fictitious company: bicycles, buses, and trains.

<p align="center"> 
<img src="./assets/list.png" width="320">
</p>

First, download the [compressed file containing the application's image resources](./downloads/res.zip), which contains all the images we will need. Copy its contents into the `app/src/main/res` folder within our project (this can be done by switching from the standard Android view in the top left to the Project view in Android Studio, or by right-clicking on the folder > Show in Explorer).

To do this, create a new *Kotlin File* in the `screen` *Package* and name it `ListScreen`, then enter the following:

```kotlin
@Composable
fun ListScreen(
    onTransportClick: (s: String) -> Unit
) {
    //TODO
}
```

Go back to the `AppNavigation` file and add the following

```kotlin
data object LoginScreenDestination
data object ListScreenDestination

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = remember { mutableStateListOf<Any>(LoginScreenDestination) }

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = { key ->
            when (key) {
                is LoginScreenDestination -> NavEntry(key) {
                    LoginScreen(onSuccess = {
                        backStack.add(ListScreenDestination)
                    })
                }

                is ListScreenDestination -> NavEntry(key) {
                    ListScreen(onTransportClick = {})
                }

                else -> {
                    error("Unknown route: $key")
                }
            }
        }
    )
}
```

There are three updates here:

* we added a singleton data class representing a new station to our `ListScreen`,
* we added the new navigation station,
* we implemented the `onSuccess` function of `LoginScreen`, in which we performed the navigation.

Next, let's create `ListScreen`:

```kotlin
@Composable
fun ListScreen(
    onTransportClick: (s: String) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clickable {
                    Log.d("ListScreen", "Bike clicked")
                    onTransportClick("Bike")
                },
        ) {

            Image(
                painter = painterResource(id = R.drawable.bikes),
                contentDescription = "Bike Button",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.FillBounds
            )
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
                    onTransportClick("Bus")
                },
        ) {

            Image(
                painter = painterResource(id = R.drawable.bus),
                contentDescription = "Bus Button",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.FillBounds
            )
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
                    onTransportClick("Train")
                },
        ) {

            Image(
                painter = painterResource(id = R.drawable.trains),
                contentDescription = "Train Button",
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.FillBounds
            )
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

@Preview
@Composable
fun PreviewListScreen() {
    ListScreen(onTransportClick = {})
}
```


???info "compact solution"
    Or for those interested, we have provided the code below. With this code we can achieve the same thing as the previous one, only we have to write less and it is a little more complex.

	```kotlin
	@Composable
	fun ListScreen(
	    onTransportClick: (s: String) -> Unit
	) {
	    Column (
	        modifier = Modifier
	            .fillMaxSize()
	    ) {
	        val type = mapOf(
	            "Bike" to R.drawable.bikes,
	            "Bus" to R.drawable.bus,
	            "Train" to R.drawable.trains
	        )
	
	        for (i in type) {
	            Box(
	                modifier = Modifier
	                    .fillMaxWidth()
	                    .weight(1f)
	                    .clickable {
	                        Log.d("ListScreen", "${i.key} clicked")
	                        onTransportClick(i.key)
	                    },
	            ) {
	
	                Image(
	                        painter = painterResource(id = i.value),
	                        contentDescription = "$i Button",
	                        modifier = Modifier.fillMaxSize(),
	                        contentScale = ContentScale.FillBounds
	                    )
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

We know from the `Box` used here that the Composables placed in it are stacked on top of each other, so we can easily achieve that there is a caption on an image. We can give `Box` a click event using the `modifier` (`Modifier.clickable{..}`), so we can easily achieve further navigation. However, this function does not work yet, because the navigation is missing the path and the onClick parameter. We will fix this in the next task.

The `Image` *Composable* function has a `painter`, a `contentDescription` and a `contentScale` parameter. We can pass these in turn using `painterResource`, `String` and `ContentScale`. We give `painterResource` the path to the image, `painterDescription` a description, and `contentScale` a `FillBounds`. With this, we can achieve that the entire area of ​​the `Box` has an image.

!!!warning "code interpretation"
With the help of the lab leader, we will discuss and interpret the code!

Let's try our application!

After logging in, we should see the created list view. Although clicking on the list items does not navigate us further, it is worth checking the logging using `LogCat`, because if we did everything correctly, we should see the click on the given vehicle.


!!!example "TO BE SUBMITTED (1 point)"
    Create a **screenshot** showing the **vehicle list** (on emulator, device mirroring or screen capture), a **corresponding code snippet**, and your **Neptune code somewhere in the code as a comment**! Upload the image to the repository in the solution as f3.png!

    The screenshot is a necessary condition for getting points!

## Detailed View (1 point)

After the user has selected the desired mode of transport, we will offer them some additional options. On this screen, they can set the dates on the pass and the discount, if any, that applies to it.

<p align="center"> 
<img src="./assets/details.png" width="320">
</p>

Create the new screen named `DetailsScreen` in the `screen` *Package* and structure it as follows:

```kotlin
@Composable
fun DetailsScreen(
    onSuccess: (s: String) -> Unit,
    transportType: String
) {
    val context = LocalContext.current

    val calendar = Calendar.getInstance()
    val year = calendar.get(Calendar.YEAR)
    val month = calendar.get(Calendar.MONTH)
    val day = calendar.get(Calendar.DAY_OF_MONTH)

    var startDate by remember {
        mutableStateOf(
            String.format(
                Locale.US,
                "%d. %02d. %02d",
                year,
                month + 1,
                day
            )
        )
    }
    var endDate by remember {
        mutableStateOf(
            String.format(
                Locale.US,
                "%d. %02d. %02d",
                year,
                month + 1,
                day
            )
        )
    }
    val currentDate = "$year. ${month + 1}. $day"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.Top,
        horizontalAlignment = Alignment.Start
    ) {
        //Pass category
        

		//Start date


        //End date
        

        //Price category
        

        //Price
        

        //Buy button
        
    }
}

@Preview
@Composable
fun PreviewDetailsScreen() {
    DetailsScreen(onSuccess = {}, transportType = "Senior Bus Pass")
}
```

**Pass category**
```kotlin
Text(
    modifier = Modifier
        .align(Alignment.CenterHorizontally)
        .padding(top = 16.dp),
    text = "${transportType} pass",
    fontSize = 24.sp
)
```

This `Text` Composable will be a header that will show what kind of ticket we are currently trying to purchase. We pass it the `transportType` parameter as text and then use `Modifier.align()` to center it in the column.

**Start date**
```kotlin
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
                startDate = String.format(
                    Locale.US,
                    "%d. %02d. %02d",
                    selectedYear,
                    selectedMonth + 1,
                    selectedDay
                )
            },
            year, month, day
        ).show()
    }) {
    Text(
        text = if (startDate.isEmpty()) currentDate else startDate,
        fontSize = 24.sp
    )
}
```
We will implement a date picker field using a `Text` and a `TextButton`. `Text` only provides information as a header, and we will pass an onClick event to `TextButton`, which will be used to implement a DatePicker dialog. We will pass the necessary parameters to it:

1. context
2. Lambda parameter, which describes what should happen during the date selection. In this case, we need to override our startDate variable.
3. Year - current year
4. Month - current month
5. Day - current day

These last three will affect the current day position of the DatePicker dialog.


**End date**
```kotlin
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
                 endDate = String.format(
                     Locale.US,
                     "%d. %02d. %02d",
                     selectedYear,
                     selectedMonth + 1,
                     selectedDay
                 )
             },
             year, month, day
         ).show()
     }) {
     Text(
         text = if (endDate.isEmpty()) currentDate else endDate,
         fontSize = 24.sp
     )
 }
```

It works similarly to *Start Date*.

**Price category**
```kotlin
val categories = listOf("Full price", "Senior", "Public servant")
var selectedCategory by remember { mutableStateOf("Full price") }
Text(
    modifier = Modifier.padding(top = 16.dp),
    text = "Price category",
    fontSize = 16.sp
)
Column(
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
```

We also give the price category section a header using `Text` *Composable*, and then within this we place a radio button section consisting of 3 categories.


**Price**

```kotlin
Text(
    fontSize = 24.sp,
    text = "Price: 42000",
    modifier = Modifier
        .align(Alignment.CenterHorizontally)
        .padding(top = 16.dp),
)
```

The price section currently only displays a static price, which can be changed during the iMSc task.

**Buy button**

```kotlin
Button(
    modifier = Modifier
        .align(Alignment.CenterHorizontally)
        .fillMaxWidth()
        .padding(top = 16.dp),
    onClick = {
        onSuccess("${startDate};$endDate;${"$selectedCategory $transportType"}")
    }) {
    Text("Buy")
}
```

We also pass an onClick event to the button, namely the lambda parameter that we received as a parameter. This can also be modified during the iMSc task.




!!!warning "Interpretation"
    The code below has a lot of formatting, so it can be difficult to interpret. Let's review and interpret it with the help of the lab leader.

Then, expand our `AppNavigation` as follows, and then discuss the code's operation with the lab leader.

```kotlin
data object LoginScreenDestination
data object ListScreenDestination
data class DetailsScreenDestination(val type: String)

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = remember { mutableStateListOf<Any>(LoginScreenDestination) }

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = { key ->
            when (key) {
                is LoginScreenDestination -> NavEntry(key) {
                    LoginScreen(onSuccess = {
                        backStack.add(ListScreenDestination)
                    })
                }

                is ListScreenDestination -> NavEntry(key) {
                    ListScreen(onTransportClick = { backStack.add(DetailsScreenDestination(it)) })
                }

                is DetailsScreenDestination -> NavEntry(key) {
                    DetailsScreen(onSuccess = {}, transportType = key.type)
                }

                else -> {
                    error("Unknown route: $key")
                }
            }
        }
    )
}
```

!!!warning ""
    Notice how we created a station that accepts a parameter, and how we pass this parameter in the case of navigation!

!!!example "TO BE SUBMITTED (1 point)"
    Create a **screenshot** showing the **detailed view** (on emulator, device mirroring or screen capture), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as f4.png!

    The screenshot is a necessary condition for getting points!



## The Pass (1 point)

The last screen of the app will be quite simple, it will represent the pass itself. Here we will display the pass type and validity period, as well as a QR code to verify the pass.

<p align="center"> 
<img src="./assets/pass.png" width="320">
</p>


Let's create the necessary *Kotlin File* also in the `screen` package, named `PassScreen`, and then write the following into it.

```kotlin
@Composable
fun PassScreen(
    passDetails: String
) {

    val parts = passDetails.split(";")

    val startDate = parts[0]
    val endDate = parts[1]
    val category = parts[2]

    Box(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Top
        ) {
            Text(
                text = "$category Pass",
                fontSize = 24.sp,
                modifier = Modifier.padding(16.dp)
            )
            Text(
                text = "$startDate - $endDate",
                fontSize = 16.sp,
                modifier = Modifier.padding(16.dp)
            )

        }
        Image(
            painter = painterResource(
                id = R.drawable.qrcode
            ),
            contentDescription = "Ticket",
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.Center),
            contentScale = ContentScale.FillWidth
        )
    }
}

@Composable
@Preview
fun PreviewPassScreen() {
    PassScreen(passDetails = "2024. 09. 01.;2024. 12. 08.;Senior Train")
}
```

Since `PassScreen` needs the ticket type and its validity period, it receives this as a parameter, then we process it within a function and use it as follows.

- `yyyy. mm. dd.;yyyy. mm. dd.;category` is the structure of the received String
- We split this along `;`, then we pass the date to the `Text` Composable value using string interpolation, and the category to another `Text` Composable

!!!info ""
    You can see that, unlike Java, Kotlin supports [string interpolation](https://kotlinlang.org/docs/reference/basic-types.html#string-templates).

Finally, we connect our new screen to `AppNavigation` similarly to the previous one, and we assign the lambda event to the previous composable:



```kotlin
data object LoginScreenDestination
data object ListScreenDestination
data class DetailsScreenDestination(val type: String)
data class PassScreenDestination(val details: String)

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = remember { mutableStateListOf<Any>(LoginScreenDestination) }

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = { key ->
            when (key) {
                is LoginScreenDestination -> NavEntry(key) {
                    LoginScreen(onSuccess = {
                        backStack.add(ListScreenDestination)
                    })
                }

                is ListScreenDestination -> NavEntry(key) {
                    ListScreen(onTransportClick = { backStack.add(DetailsScreenDestination(it)) })
                }

                is DetailsScreenDestination -> NavEntry(key) {
                    DetailsScreen(
                        onSuccess = { backStack.add(PassScreenDestination(it)) },
                        transportType = key.type
                    )
                }

                is PassScreenDestination -> NavEntry(key) {
                    PassScreen(passDetails = key.details)
                }

                else -> {
                    error("Unknown route: $key")
                }
            }
        }
    )
}
```


!!!example "TO BE SUBMITTED (1 point)"
    Create a **screenshot** showing the **passport screen** (on an emulator, mirroring the device or by screen recording), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**. Upload the image to the repository in the solution as f5.png.

    The screenshot is a necessary condition for obtaining a score.

## Independent task - Boat pass (1 point)

As our company expanded, we also launched a boat pass service. Let's add this new pass type to our application!

???success "Help"
    Most of the necessary changes will be in the `ListScreen`. A new `Box` must be added to the 3 options so far, and the new option must be converted similarly to the previous ones.

!!!example "TO BE SUBMITTED (1 point)"
    Create **two screenshots** showing the **vehicle selection screen** and the **boat pass screen** (on an emulator, by mirroring the device or by taking a screenshot), and the **corresponding code snippet**, as well as **your neptun code somewhere in the code as a comment**! Upload the images to the repository in the solution as f6.png and f7.png!

    Screenshots are necessary conditions for getting points!


## Extra tasks

!!!warning "Introductory"
    These tasks are not required to obtain the maximum score for the lab, they are merely introductory in the lab material for those who would like to delve deeper into the topic.


### Extra task - SplashScreen animation

Thanks to the SplashScreen API, we have already seen that we can easily create a splash screen that we see immediately after opening the application. We can also easily animate the Icon that appears on it, for this we only need to create a few `.xml` files using Android Studio, in which we will implement these operations.

We need the following:

* Logo - This is what we will display on the splash screen. (We have already created this before, we will just modify it)
* Animator - In this we will describe the animation that we want to use on the given Logo.
* Animated Vector Drawable - With this, the Animator and the Logo will be connected.
* Themes - We will also only modify this
* Animation - In this we can specify Interpolations in addition to the animations

**Modify Logo**

Modify the existing Logo as follows.
(`ic_transport_foreground.xml`)

```xml
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="24"
    android:viewportHeight="24"
    android:tint="#FFFF00">
  <group
      android:name="animationGroup"
      android:pivotX="12"
      android:pivotY="12">
    <path
        android:fillColor="@android:color/white"
        android:pathData="M4,16c0,0.88 0.39,1.67 1,2.22L5,20c0,0.55 0.45,1 1,1h1c0.55,0 1,-0.45 1,-1v-1h8v1c0,0.55 0.45,1 1,1h1c0.55,0 1,-0.45 1,-1v-1.78c0.61,-0.55 1,-1.34 1,-2.22L20,6c0,-3.5 -3.58,-4 -8,-4s-8,0.5 -8,4v10zM7.5,17c-0.83,0 -1.5,-0.67 -1.5,-1.5S6.67,14 7.5,14s1.5,0.67 1.5,1.5S8.33,17 7.5,17zM16.5,17c-0.83,0 -1.5,-0.67 -1.5,-1.5s0.67,-1.5 1.5,-1.5 1.5,0.67 1.5,1.5 -0.67,1.5 -1.5,1.5zM18,11L6,11L6,6h12v5z"/>
  </group>
</vector>
```

We wrapped the existing path in a group tag, which is needed to animate the icon. We give this group a name that we will use when animating, which group we want, and set the pivotX and pivotY points. In this case, we will set it to the center, because we want to animate the Logo from the center.

**Creating an Animator**

In order to animate the Logo, we need to create an Animator type file. Right-click on the `res` folder, then *New->Android Resource file*, enter `logo_animator` as the name, `Animator` as the type, and `objectAnimator` as the Root element, then click the OK button. This has created the necessary file, all we need to do is write the animations. First, set the duration of the animation, we can do this using `android:duration` within the `objectAnimator` tag.

* Initially set to one second (1000).
* Next, we give the Logo a Scale animation, which allows us to make it appear from scratch and grow linearly over the duration of the animation. For this, we need a `propertyValuesHolder` tag inside the `objectAnimator`.

```xml
<objectAnimator xmlns:android="http://schemas.android.com/apk/res/android"
    android:duration="1000"
    android:interpolator="@android:anim/overshoot_interpolator">

    <propertyValuesHolder
        android:propertyName="scaleX"
        android:valueType="floatType"
        android:valueFrom="0.0"
        android:valueTo="0.5" />

    <propertyValuesHolder
        android:propertyName="scaleY"
        android:valueType="floatType"
        android:valueFrom="0.0"
        android:valueTo="0.5" />

</objectAnimator>
```

In this short animation code, we just increase the size of the Logo from 0 to 0.5. We can specify the animation in the propertyName, which can be scaleX, scaleY, rotation, etc... and in valuesFrom/To we can specify the start-target size.

To connect this animation to the Logo, we need to create an Animated Vector Drawable.

**Animated Vector Drawable**

Let's create the Animated Vector Drawable file using Android Studio. Right-click on our drawable folder, then *New->Drawable Resource File*. Here, we give the name `animated_logo` and the root element `animated-vector`, then click the OK button. This will create the required file. Complete it as follows:

```xml
<animated-vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:drawable="@drawable/ic_transport_foreground">

    <target
        android:animation="@animator/logo_animator"
        android:name="animationGroup" />

</animated-vector>
```

*   Az `android:drawable` segítségével megadjuk azt a fájlt amit szeretnénk animálni.
*   Az `android:animation` segítségével pedig, hogy melyik animációt szeretnénk használni.
*   Valamint az `android:name` segítségével azt a csoportot amelyiket szeretnénk animálni az adott Logo-n belül.

We have already created the theme for the splashscreen, but it was only for the plain Logo. To use the animated Logo, we need to modify it as follows.

**Modifying Themes**

```xml
<style name="Theme.PublicTransport.Starting" parent="Theme.SplashScreen">
    <item name="windowSplashScreenBackground">#5A3DDC</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/animated_logo</item>
    <item name="android:windowSplashScreenIconBackgroundColor">#5A3DDC</item>
    <item name="postSplashScreenTheme">@style/Theme.PublicTransport</item>
</style>
```
Here we just replaced AnimatedIcon with `animated_logo` instead of the plain one.

**Animation - Interpolations**

The instalSplashScreen has a lambda parameter: `apply{}`. Within this, we can specify different operations. For example, `setKeepOnScreenCondition` allows us to keep the SplashScreen on the screen until a certain condition is met. Generally, it is worth performing database reads or things that are time-consuming and only need to be executed once during the application startup within this block. If these are executed, a condition is met and the SplashScreen disappears. `setOnExitAnimationListener` - Within this, we can specify an animation that is executed if `setKeepOnScreenCondition` does not keep the SplashScreen in the foreground and the application is about to change screens. In such cases, we can also execute an exit animation. For example, the following:

```kotlin
installSplashScreen().apply {
    setOnExitAnimationListener{ splashScreenView ->
        val zoomX = ObjectAnimator.ofFloat(
            splashScreenView.iconView,
            "scaleX",
            0.5f,
            0f
        )
        zoomX.interpolator = OvershootInterpolator()
        zoomX.duration = 500
        zoomX.doOnEnd { splashScreenView.remove() }
        val zoomY = ObjectAnimator.ofFloat(
            splashScreenView.iconView,
            "scaleY",
            0.5f,
            0f
        )
        zoomY.interpolator = OvershootInterpolator()
        zoomY.duration = 500
        zoomY.doOnEnd { splashScreenView.remove()}
        zoomX.start()
        zoomY.start()
    }
}
```

Let's paste this into the `MainActivity` `onCreate()` function in the appropriate place, then test the application!

### Extra task - Navigation-Splash

Previously, we solved this screen using the [Splash Screen API](https://developer.android.com/develop/ui/views/launch/splash-screen), but there are several options, of which we will now look at one using navigation.

This screen is essentially the same screen as the others. Here, first, let's create a new *Kotlin File* inside the `screen` package, then name it `SplashScreen`, and write the following code in it:

```kotlin
@Composable
fun SplashScreen(
    onSuccess: () -> Unit
) {
    LaunchedEffect(key1 = true) {
        delay(1000)
        onSuccess()
    }
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Blue),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Image(
            modifier = Modifier
                .size(128.dp),
            painter = painterResource(id = R.drawable.ic_transport_foreground),
            contentDescription = "Public Transport",
        )
    }
}
```

LaunchedEffect will be discussed in more detail in the presentation. It was needed here, because the delay function in it cannot be called by itself: it can be used inside a *suspend* function or a *coroutine*. The delay function is responsible for how long the SplashScreen should be on the screen. In this case, it is 1 second (1000 milliseconds), after which the onSuccess lambda is called, which navigates us to the LoginScreen.

Let's modify our `AppNavigation` as follows:

```kotlin
data object SplashScreenDestination
...

@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = remember { mutableStateListOf<Any>(SplashScreenDestination) }

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = { key ->
            when (key) {
                is SplashScreenDestination -> NavEntry(key) {
                    SplashScreen(onSuccess = {
                        backStack.removeLastOrNull()
                        backStack.add(LoginScreenDestination)
                    })
                }

                ...
            }
        }
    )
}
```

We will not be dealing with the customization of the `SplashScreen` screen within the scope of the lab, it is completely customizable.

Notice that here we not only perform the navigation in the `onSuccess` *callback*, but we first remove the `SplashScreen` from the *backstack* so that it cannot be navigated back there under any circumstances.

Then the `Manifest` file can be customized to display what theme.


### Extra Task - More transparent navigation

In large projects with multiple screens, the navigation file can grow large after a while. On the one hand, in this case, we can break the navigation into smaller sub-navigations, and then combine them in a main navigation file. On the other hand, we can organize the management of our *stations* a little better. A common solution to this is to collect the screens and their associated navigation paths into a separate `Screen` class, and then use only the objects formed from them in the navigation file. The `Screen` file created earlier will contain the following code:

```kotlin
sealed interface Screen : NavKey {
	@Serializable
    data object SplashScreenDestination : Screen
	@Serializable
    data object LoginScreenDestination : Screen
	@Serializable
    data object ListScreenDestination : Screen
	@Serializable
    data class DetailsScreenDestination(val type: String) : Screen
	@Serializable
    data class PassScreenDestination(val details: String) : Screen
}
```
You can see that our *interface* implements a `NavKey` *interface*. This does not contain any relevant code, just an indication that we will use these objects during navigation.

!!!info "sealed class"
    Kotlin's sealed classes are classes that have limited inheritance, and all their descendants are known at compile time. We can use these classes in a similar way to enums. In this case, `Details` is not actually a direct descendant of `Screen`, but an anonymous descendant of it, since it also includes the handling of the username as a parameter.

After this, we can delete the stations from our `AppNavigation` and simplify the `entryProvider`:

```kotlin
@Composable
fun AppNavigation(modifier: Modifier = Modifier) {
    val backStack = remember { mutableStateListOf<Screen>(Screen.LoginScreenDestination) }

    NavDisplay(
        modifier = modifier,
        backStack = backStack,
        onBack = { backStack.removeLastOrNull() },
        entryProvider = entryProvider {

            entry<Screen.LoginScreenDestination> {
                LoginScreen(onSuccess = {
                    backStack.add(Screen.ListScreenDestination)
                })
            }

            entry<Screen.ListScreenDestination> {
                ListScreen(onTransportClick = { backStack.add(Screen.DetailsScreenDestination(it)) })
            }

            entry<Screen.DetailsScreenDestination> { key ->
                DetailsScreen(
                    onSuccess = { backStack.add(Screen.PassScreenDestination(it)) },
                    transportType = key.type
                )
            }

            entry<Screen.PassScreenDestination> { key ->
                PassScreen(passDetails = key.details)
            }
        }
    )
}
```

During the lab, we noticed that if we rotated our device, we were always returned to the login page. This is because when the *Activity* is terminated, the *backstack* in it is also terminated. If we want our application to work properly and preserve the state of our navigation, we need to indicate that what we store in the `backStack` is a real *navigation backstack*.

So let's change the definition of `backStack` in our `AppNavigation`:

```kotlin
val backStack = rememberNavBackStack(Screen.LoginScreenDestination)
```

Let's try to see if our application works correctly even when rotated!


## iMSc task


Earlier, in the detailed view, we printed a fixed price to the screen. Let's write the logic that calculates the price of the pass, and as the user changes the parameters of the pass, update the displayed price.

The pricing should work as follows:

| Means of transport | Rental price per day |
| ------------------ | ------------------ |
| Bicycle | 700 |
| Bus | 1000 |
| Train | 1500 |
| Boat | 2500 |

We also give the following discounts:

| Price category | Discount amount |
| -------------- | ------------------ |
| Full price | 0% |
| Pensioner | 90% |
| Public employee | 50% |

???tip "Tip"
    For calculations and event handling, it is worth using the [`Calendar`](https://developer.android.com/reference/java/util/Calendar.html) class and the *Calendar.set* function.

    It is worth writing two functions for the calculations:

    - One function is a difference calculator that calculates the days between two dates
    - The other function calculates the price based on the days and the category

### Different daily pass prices (1 IMSc point)

!!!example "TO BE SUBMITTED (1 IMSc point)"
    Create a **screenshot** showing a **detailed view of a multi-day pass with the price** (on an emulator, device mirroring or screenshot), **with the code related to the pass prices**, and **your neptun code as a comment somewhere in the code**! Upload the image to the repository in the solution as f8.png!

    The screenshot is a necessary condition for getting points!

### Percentage discounts (1 IMSc point)

!!!example "TO BE SUBMITTED (1 IMSc point)"
    Create a **screenshot** showing a **detailed view of a multi-day discount pass with price** (on emulator, device mirroring or screenshot), **with the code related to the pass discounts**, and **your neptun code as a comment somewhere in the code**! Upload the image to the repository in the solution as f9.png!

    The screenshot is a necessary condition for getting points!
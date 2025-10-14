# Labor 06 - Room - Shopping list app

## Introduction
The task of the lab is to create a shopping list application. The application allows you to record, delete and mark the desired products as purchased. The application stores the products persistently. In addition to functionality, the project also places great emphasis on architectural issues.

The application displays the list of products in [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists) and persistently stores the list items and their status using the ORM library called [`Room`](https://developer.android.com/training/data-storage/room). A new item can be added by pressing a [`FloatingActionButton`](https://developer.android.com/develop/ui/compose/components/fab).


!!!info "ORM"
    ORM = [Object-relational mapping](https://en.wikipedia.org/wiki/Object-relational_mapping)

Technologies used:

- [`Scaffold`](https://developer.android.com/develop/ui/compose/components/scaffold)
- [`AppBar`](https://developer.android.com/develop/ui/compose/components/app-bars)
- [`FloatingActionButton`](https://developer.android.com/develop/ui/compose/components/fab)
- [`Dialog`](https://developer.android.com/develop/ui/compose/components/dialog)
- [`ExposedDropdownMenu`](https://developer.android.com/reference/kotlin/androidx/compose/material/ExposedDropdownMenuBoxScope)
- [`LazyColumn`](https://developer.android.com/develop/ui/compose/lists)
- [`ViewModel`](https://developer.android.com/topic/libraries/architecture/viewmodel)
- [`Repository Pattern`](https://developer.android.com/codelabs/basic-android-kotlin-compose-add-repository)
- [`Room`](https://developer.android.com/training/data-storage/room)

### Application Specification
The application consists of an `Activity`, which will have a *Composable* class, `MainScreen`. We can add a new item using the `FloatingActionButton` in the lower right corner. By clicking on this, a dialog will appear, where we can enter the name, description, estimated price and category of the product we want to buy.

By clicking on the *Save* button on the dialog, the dialog will disappear, and a new item will be created in the list with the data entered in it. On each list item, we can indicate that we have already purchased it using `CheckBox`. We can delete the given item by clicking on the trash icon.
We can delete all list items with the *Delete all* option in the menu.


<p align="center">
<img src="./assets/shopping_list.png" width="320">
<img src="./assets/new_item.png" width="320">
</p>

### Lab tasks
During the lab, the following tasks must be completed with the help of the lab leader, and the assigned tasks must be completed independently.

1. Implementing the addition of a new element: 1 point
1. Designing the *viewModel* and *repository*: 1 point
1. Implementing persistent data storage: 1 point
1. **Independent task** (implementing deletion): 1 point
1. **Independent task** (confirmation dialogue): 1 point


## Preparations

When solving the tasks, do not forget to follow the [task submission process](../github/).

### Creating and downloading a Git repository

1. Find the lab invitation URL in Moodle and use it to create your own repository.

1. Wait until the repository is ready, then checkout it.

    !!! tip ""
        In university labs, if the system does not ask for a username and password during checkout and the checkout fails, the system probably tried to use a username previously saved on the computer. First, delete the saved login data and try again.

1. Create a new branch called `solution` and work on this branch.

1. Write your Neptun code in the `neptun.txt` file. The file should contain nothing else, except the 6 characters of the Neptun code on a single line.


### Opening a project

In this lab, we will not create a new project, but will start from an existing one, which already contains the basics learned in the previous labs. The project can be found in the checked-out repository under the name *ShoppingList*. Let's open the project and review its structure with the lab leader!

#### Dependencies

The project contains all the dependencies needed during the lab, these will not need to be added again later, but we will include them in the given section.

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

androidx-room-runtime = {group = "androidx.room", name="room-runtime", version.ref= "room" }
androidx-room-compiler = {group = "androidx.room", name="room-compiler", version.ref= "room" }
androidx-room-ktx = {group = "androidx.room", name="room-ktx", version.ref= "room" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }

google-devtools-ksp = { id = "com.google.devtools.ksp", version.ref="ksp"}
```

Project level `build.gradle.kts`:

```kts
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false

    alias(libs.plugins.google.devtools.ksp) apply false
}
```

Modul level `build.gradle.kts`:

```kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)

    alias(libs.plugins.google.devtools.ksp)
}

android {
    namespace = "hu.bme.aut.android.shoppinglist"
    compileSdk = 36

    defaultConfig {
        applicationId = "hu.bme.aut.android.shoppinglist"
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

    ksp(libs.androidx.room.compiler)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
}
```

#### Resources

The project includes the application icons, necessary graphic resources, and text resources:

`strings.xml`:

```xml
<resources>
    <string name="app_name">ShoppingList</string>
    <string name="add_shopping_item">Add Shopping Item</string>
    <string name="edit_shopping_item">Edit Shopping Item</string>
    <string name="label_name">Name</string>
    <string name="label_description">Description</string>
    <string name="label_estimated_price">Estimated price</string>
    <string name="label_already_purchased">Already purchased</string>
    <string name="label_category">Category</string>
    <string name="cancel">Cancel</string>
    <string name="save">Save</string>
    <string name="label_purchased">Purchased\n</string>
    <string name="label_not_purchased">Not\nPurchased</string>
    <string name="category_food">Food</string>
    <string name="category_book">Book</string>
    <string name="category_electronics">Electronics</string>
</resources>
```

#### The Model

Our application will display a shopping list, including shopping items. This will be important for both the user interface and persistent data storage. Within the `data` *package*, in the `entities` *package*, we have a `ShoppingItem` data class.

`ShoppingItem.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.data.entities

data class ShoppingItem(
		var id: Long? = null,
        var name: String,
        var description: String,
        var category: Category,
        var estimatedPrice: Int,
        var isBought: Boolean
){
    enum class Category{
        FOOD, ELECTRONIC, BOOK
    }
}
```

Our item contains an ID, a name, a description, a category, a price and a switch that tells us whether the item has already been purchased or not. We implemented the selectable categories as an internal *enum class*.

!!!info "data class"
    Kotlin allows you to create a so-called data class. This can probably be most easily compared to Java's POJO (Plain-Old-Java-Object) classes. Their purpose is to store related data in public properties, nothing more! In addition, certain helper functions are automatically created, such as a suitable equals, toString and copy implementation.

#### The user interface

The user interface of our application is quite simple. It contains a *screen* with a `TopBar`, a list of items and a `FloatingActionButton`. Pressing the button will open a dialog window for adding a new item. `ShoppingListScreen` is located in the `hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist` *package*, and its building blocks are located in a `components` *package* within it:

`ShoppingListTopBar.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.ui,screen.shoppinglist.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.tooling.preview.Preview
import hu.bme.aut.android.shoppinglist.R

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShoppingListTopBar() {
    TopAppBar(
        title = {
            Text(
                text = stringResource(id = R.string.app_name),
                color = MaterialTheme.colorScheme.onPrimary
            )
        },
        actions = {
            IconButton(
                onClick = {
                    /*TODO*/
                }
            ) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    tint = MaterialTheme.colorScheme.onPrimary,
                    contentDescription = "Delete all items"
                )
            }
        },
        colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.primary)
    )
}

@Preview
@Composable
fun MainTopBarPreview() {
    ShoppingListTopBar()
}
```

We pass a name to the `TopAppBar` built-in *Composable* function with the *title* parameter and an action button with the *actions* parameter. In this case, we will add a `Delete all items` button, the functionality of which must be implemented in the standalone task part.

`ItemShoppingItem.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import hu.bme.aut.android.shoppinglist.R
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem

@Composable
fun UIShoppingItem(
    shoppingItem: ShoppingItem,
    onCheckBoxClick: (ShoppingItem) -> Unit,
    onDeleteIconClick: () -> Unit,
    onEditIconClick: (ShoppingItem) -> Unit
) {
    var isChecked by remember { mutableStateOf(shoppingItem.isBought) }
    var isInteractionPanelExpanded by remember { mutableStateOf(false) }
    val image = when (shoppingItem.category) {
        ShoppingItem.Category.FOOD -> R.drawable.groceries
        ShoppingItem.Category.ELECTRONIC -> R.drawable.lightning
        ShoppingItem.Category.BOOK -> R.drawable.open_book
        else -> R.drawable.groceries
    }

    Row(
        modifier = Modifier
            .padding(8.dp)
            .fillMaxWidth()
            .clickable(onClick = { isInteractionPanelExpanded = !isInteractionPanelExpanded }),
        verticalAlignment = Alignment.CenterVertically
    ) {

        Image(
            modifier = Modifier
                .size(80.dp),
            painter = painterResource(image),
            contentDescription = "image"
        )
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .weight(2f),
            horizontalAlignment = Alignment.Start
        ) {
            Text(
                text = shoppingItem.name,
                fontSize = 20.sp,
                maxLines = 1
            )
            Text(
                text = shoppingItem.description,
                maxLines = 2,
                fontStyle = FontStyle.Italic
            )
            Text(
                text = "${shoppingItem.estimatedPrice} Ft",
                color = Color.DarkGray,
                maxLines = 1
            )
        }
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.weight(1f)
        ) {
            Checkbox(
                checked = shoppingItem.isBought,
                onCheckedChange = {
                    isChecked = it

                    onCheckBoxClick(shoppingItem.copy(isBought = isChecked))
                },
                colors = CheckboxDefaults.colors(
                    checkedColor = Color.Green,
                    uncheckedColor = Color.Red,
                    checkmarkColor = Color.White
                ),
            )
            Text(
                text = if (shoppingItem.isBought) stringResource(R.string.label_purchased) else stringResource(R.string.label_not_purchased),
                textAlign = TextAlign.Center
            )
        }
        if (isInteractionPanelExpanded)
            Column() {
                IconButton(
                    modifier = Modifier.background(MaterialTheme.colorScheme.inversePrimary),
                    onClick = {
                        /*TODO*/
                        isInteractionPanelExpanded = false
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Delete"
                    )
                }
                Spacer(modifier = Modifier.height(8.dp))
                IconButton(
                    modifier = Modifier.background(MaterialTheme.colorScheme.inversePrimary),
                    onClick = {
                        /*TODO*/
                        isInteractionPanelExpanded = false
                    }
                ) {
                    Icon(
                        imageVector = Icons.Default.Edit,
                        contentDescription = "Edit"
                    )
                }
            }
    }
}

@Preview(showBackground = true)
@Composable
fun ItemShoppingItemPurchasedPreview() {
    UIShoppingItem(
        shoppingItem = ShoppingItem(
            name = "LongItemName",
            description = "description",
            estimatedPrice = 500,
            category = ShoppingItem.Category.BOOK,
            isBought = true
        ),
        onDeleteIconClick = {},
        onCheckBoxClick = {},
        onEditIconClick = {}
    )
}

@Preview(showBackground = true)
@Composable
fun ItemShoppingItemNotPurchasedPreview() {
    UIShoppingItem(
        shoppingItem = ShoppingItem(
            name = "LongItemName",
            description = "description description description description description",
            estimatedPrice = 500,
            category = ShoppingItem.Category.ELECTRONIC,
            isBought = false
        ),
        onDeleteIconClick = {},
        onCheckBoxClick = {},
        onEditIconClick = {}
    )
}
```

The interface displays the `ShoppingItem` data. On the left side, the category-dependent image, in the middle, the name, description and price, and on the right side, the *CheckBox*, which indicates the purchase of the product. In addition, a panel containing the delete and modify buttons can be opened on the right edge of the interface when touched.

You can see that the interface takes over the `ShoppingItem` to be displayed, as well as three *callback* functions: the *CheckBox*, the delete and the modify icons to handle touch events. Of these, only the *CheckBox* is used for now (the others will be independent tasks), where the changed state is returned with the method.

Now that we have our components, we can finally assemble them into our `ShoppingListScreen`:

`ShoppingListScreen.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.LargeFloatingActionButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist.components.ShoppingListTopBar
import hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist.components.UIShoppingItem


@Composable
fun ShoppingListScreen(modifier : Modifier = Modifier) {

    val list = remember {
        mutableStateListOf(
            ShoppingItem(
                id = 1,
                name = "Alma",
                description = "jonatán\n1 kg",
                estimatedPrice = 500,
                category = ShoppingItem.Category.FOOD,
                isBought = true
            ),
            ShoppingItem(
                id = 2,
                name = "A gyűrűk ura",
                description = "A gyűrű szövetsége",
                estimatedPrice = 8000,
                category = ShoppingItem.Category.BOOK,
                isBought = false
            )
        )
    }

    Scaffold(
        modifier = modifier,
        topBar = {
            ShoppingListTopBar()
        },
        floatingActionButton = {
            LargeFloatingActionButton(
                containerColor = MaterialTheme.colorScheme.primary,
                onClick = {
                    /*TODO*/
                }) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add new item"
                )
            }
        }
    ) { innerPadding ->

        LazyColumn(
            modifier = Modifier.padding(innerPadding)
        ) {
            items(list, key = { item -> item.id!! }) {

                UIShoppingItem(
                    shoppingItem = it,
                    onCheckBoxClick = { shoppingItem ->
                        /*TODO*/
                    },
                    onDeleteIconClick = {
                        /*TODO*/
                    },
                    onEditIconClick = {
                        /*TODO*/
                    }
                )
                if (list.indexOf(it) < list.size - 1) {
                    HorizontalDivider()
                }
            }
        }
    }

}

@Preview
@Composable
fun MainScreenPreview() {
    ShoppingListScreen()
}
```

Now all we have to do is display our own `ShoppingListScreen` in `MainActivity`:

`MainActivity.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.ui.Modifier
import hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist.ShoppingListScreen
import hu.bme.aut.android.shoppinglist.ui.theme.ShoppingListTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ShoppingListTheme {
                ShoppingListScreen(modifier = Modifier.safeDrawingPadding())
            }
        }
    }
}
```

Let's try the application!

Our list is now displayed, but we cannot modify the individual items or add new items.

## Add new item (1 point)

### Dialog

We want a dialog window to open when we press the *FloatingActionButton* on the `ShoppingListScreen`, where we can enter the details of the new products and then add them to our list. Let's create this dialog in the `hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist.components` *package*.

On the interface, one below the other, we find:

- the title of the dialog,
- the name input field,
- the price input field, which we can only enter a number in,
- the description input field,
- the category drop-down menu, which consists of an *OutlinedTextField* and an *ExposedDropdownMenu*,
- the *CheckBox* indicating the purchase status, and
- the two action buttons, whose *callbacks* we take as parameters.

`ShoppingItemDialog.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CheckboxDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuAnchorType
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import hu.bme.aut.android.shoppinglist.R
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ShoppingItemDialog(
    modifier : Modifier = Modifier,
    shoppingItem: ShoppingItem? = null,
    onDismissRequest: () -> Unit = {},
    onSaveClick: (ShoppingItem) -> Unit
) {

    val coroutineScope = rememberCoroutineScope()
    var name by remember { mutableStateOf(shoppingItem?.name ?: "") }
    var description by remember { mutableStateOf(shoppingItem?.description ?: "") }
    var price by remember { mutableStateOf(shoppingItem?.estimatedPrice?.toString() ?: "") }
    var category by remember {
        mutableStateOf(
            shoppingItem?.category ?: ShoppingItem.Category.FOOD
        )
    }
    var isBought by remember { mutableStateOf(shoppingItem?.isBought ?: false) }

    var isCategoryDropdownExpanded by remember { mutableStateOf(false) }
    var isNameError by remember { mutableStateOf(name.isEmpty()) }
    val categoryOptions = ShoppingItem.Category.entries.toList()

    Column(
        modifier = modifier
            .background(Color.White)
    ) {
        //Title of the Dialog Window
        Text(
            text =
            if (shoppingItem?.id == null)
                stringResource(id = R.string.add_shopping_item)
            else
                stringResource(id = R.string.edit_shopping_item),
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            fontWeight = FontWeight.Bold,
            fontSize = 20.sp
        )

        //Name of the item
        OutlinedTextField(
            modifier = Modifier
                .padding(8.dp)
                .fillMaxWidth(),
            value = name,
            label = { Text(text = stringResource(R.string.label_name)) },
            onValueChange = {
                name = it
                isNameError = it.isEmpty()
            },
            maxLines = 1,
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
            isError = isNameError
        )

        //Price of the item
        OutlinedTextField(
            value = price,
            label = { Text(text = stringResource(R.string.label_estimated_price)) },
            modifier = Modifier
                .padding(8.dp)
                .fillMaxWidth(),
            onValueChange = { price = it },
            maxLines = 1,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Decimal,
                imeAction = ImeAction.Next
            )
        )

        //Description of the item
        OutlinedTextField(
            modifier = Modifier
                .padding(8.dp)
                .fillMaxWidth(),
            value = description,
            label = { Text(text = stringResource(R.string.label_description)) },
            onValueChange = { description = it },
            maxLines = 2
        )

        //Dropdown Menu for the category of the item
        ExposedDropdownMenuBox(
            expanded = isCategoryDropdownExpanded,
            onExpandedChange = { isCategoryDropdownExpanded = !isCategoryDropdownExpanded }) {

            OutlinedTextField(
                modifier = Modifier
                    .menuAnchor(type = ExposedDropdownMenuAnchorType.PrimaryNotEditable)
                    .padding(8.dp)
                    .fillMaxWidth(),
                value = getCategoryTextByCategory(category = category),
                label = {
                    Text(text = stringResource(id = R.string.label_category))
                },
                onValueChange = {},
                readOnly = true,
                trailingIcon = {
                    ExposedDropdownMenuDefaults.TrailingIcon(expanded = isCategoryDropdownExpanded)
                })

            ExposedDropdownMenu(
                expanded = isCategoryDropdownExpanded,
                onDismissRequest = { isCategoryDropdownExpanded = false }) {
                categoryOptions.forEach { option ->
                    DropdownMenuItem(
                        onClick = {
                            category = option
                            isCategoryDropdownExpanded = false
                        },
                        text = {
                            Text(
                                text = getCategoryTextByCategory(option)
                            )
                        },
                        contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                    )
                }
            }
        }

        //Row for the checkbox if the item is already bought
        Row(
            modifier = Modifier.padding(8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = isBought,
                onCheckedChange = {
                    isBought = it
                },
                colors = CheckboxDefaults.colors(
                    checkedColor = Color.Green,
                    uncheckedColor = Color.Black,
                    checkmarkColor = Color.White
                )
            )
            Text(text = stringResource(R.string.label_already_purchased))
        }

        //Row for the buttons
        Row( //Row for the buttons
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.End
        ) {
            OutlinedButton(
                onClick = {
                    onDismissRequest()
                },
                shape = RectangleShape
            ) {
                Text(text = stringResource(R.string.cancel))
            }
            Spacer(modifier = Modifier.width(16.dp))
            Button(
                onClick = {
                    if (!isNameError) {
                        coroutineScope.launch {
                            onDismissRequest()
                            onSaveClick(
                                ShoppingItem(
                                    id = shoppingItem?.id,
                                    name = name,
                                    description = description,
                                    estimatedPrice = if (price.isNotEmpty()) price.toInt() else 0,
                                    category = category,
                                    isBought = isBought
                                )
                            )
                        }
                    }
                },
                shape = RectangleShape
            ) {
                Text(text = stringResource(R.string.save))
            }
        }
    }
}

@Composable
private fun getCategoryTextByCategory(category: ShoppingItem.Category) =
    when (category) {
        ShoppingItem.Category.ELECTRONIC -> stringResource(id = R.string.category_electronics)
        ShoppingItem.Category.BOOK -> stringResource(id = R.string.category_book)
        else -> stringResource(id = R.string.category_food)
    }


@Preview
@Composable
fun NewShoppingItemDialogPreview() {
    ShoppingItemDialog(onSaveClick = {})
}

@Preview
@Composable
fun EditShoppingItemDialogPreview() {
    ShoppingItemDialog(
        shoppingItem = ShoppingItem(
            name = "name",
            description = "description",
            estimatedPrice = 500,
            category = ShoppingItem.Category.BOOK,
            isBought = true
        ),
        onSaveClick = {}
    )
}
```

As you can see, in `ShoppingItemDialog` we store as state:

- the name: `name`,
- the description: `description`,
- the price: `price`:
- the category: `category`,
- the purchase status: `isBought`,
- whether the category *Dropdown* is open: `isCategoryDropdownExpanded` and
- whether there is an error in the name field, i.e. whether it is empty: `isNameError`.

We want `ShoppingItemDialog` to be reusable, i.e. not only for adding a new item, but also for editing. To do this, we take a *shoppingItem* as a parameter. If it is null, we add a new item, if not, we edit it.

### Rendering and Updating

Now that our dialog interface is ready, let's render it! We'll bind the visibility of the `ShoppingItemDialog` to a state variable on the `ShoppingListScreen`, which we'll set when the *FloatingActionButton* is pressed:

```kotlin
@Composable
fun ShoppingListScreen(modifier : Modifier = Modifier) {

    var isDialogOpen by remember { mutableStateOf(false) }

    ...

    Scaffold(
        modifier = modifier,
        topBar = {
            ShoppingListTopBar()
        },
        floatingActionButton = {
            LargeFloatingActionButton(
                containerColor = MaterialTheme.colorScheme.primary,
                onClick = {
                    isDialogOpen = true
                }) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add new item"
                )
            }
        }
    ) { 
		...
    }

    if (isDialogOpen) {
        Dialog(onDismissRequest = { isDialogOpen = false }) {
            ShoppingItemDialog(
                onDismissRequest = { isDialogOpen = false },
                onSaveClick = { newShoppingItem ->
                    newShoppingItem.id = Random.nextLong()
                    list += newShoppingItem
                }
            )
        }
    }
}
```

Our application now has a dialog box, and we can add a new item to our list, but the modification still doesn't work. Let's also make sure that the interface refreshes when the *CheckBox* is pressed. To do this, we need to define the appropriate *callBack* function:

```kotlin
onCheckBoxClick = { shoppingItem ->
    list[list.indexOf(it)] = shoppingItem
},
```

Let's try the application!

!!!example "TO BE SUBMITTED (1 point)"
    Take a **screenshot** of the **updated and expanded list** (on an emulator, mirroring your device, or with a screenshot), a **corresponding code snippet**, and your **neptun code as the name of one of the products**! Upload the image to the repository in the solution as **f1.png**!

    The screenshot is a necessary condition for getting points.


## Designing the architecture (1 point)

You can see that our list is currently burned in and stored in a *screen composable* in a rather ugly way. (In addition, if we rotate our device, the entire list will reset.) We did this for quick testing, but now we are creating the appropriate architecture. Initially, we will still stick with the list stored in memory, but we will choose their location in a more architecturally appropriate way.

### Creating the repository

Our data typically comes from a data source, a *repository*. There can be several implementations of this, even in parallel. Let's define an *interface* and a specific implementation (which is still memory-based) in the `hu.bme.aut.android.shoppinglist.data.repository` *package*:

`IShoppingItemRepository.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.data.repository

import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem
import kotlinx.coroutines.flow.Flow

interface IShoppingItemRepository {

    fun getAllItems(): Flow<List<ShoppingItem>>
    suspend fun insert(shoppingItem: ShoppingItem)
    suspend fun update(shoppingItem: ShoppingItem)
    suspend fun delete(shoppingItem: ShoppingItem)
}
```

`MemoryShoppingItemRepository.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.data.repository

import androidx.compose.runtime.mutableStateListOf
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow

class MemoryShoppingItemRepository : IShoppingItemRepository {

    private var list = mutableStateListOf(
        ShoppingItem(
            id = 1,
            name = "Alma",
            description = "jonatán\n1 kg",
            estimatedPrice = 500,
            category = ShoppingItem.Category.FOOD,
            isBought = true
        ),
        ShoppingItem(
            id = 2,
            name = "A gyűrűk ura",
            description = "A gyűrű szövetsége",
            estimatedPrice = 8000,
            category = ShoppingItem.Category.BOOK,
            isBought = false
        )
    )

    override fun getAllItems(): Flow<List<ShoppingItem>> = flow {
            emit(list)
        }

    override suspend fun insert(shoppingItem: ShoppingItem) {
        delay(1000)
        list.add(shoppingItem.copy(id = (Long.MAX_VALUE*Math.random()).toLong()))
    }

    override suspend fun update(shoppingItem: ShoppingItem) {
        delay(1000)
        for (item in list) {
            if (item.id == shoppingItem.id)
                list[list.indexOf(item)] = shoppingItem
        }
    }

    override suspend fun delete(shoppingItem: ShoppingItem) {
        delay(1000)
        list.remove(shoppingItem)
    }
}
```

`IShoppingItemRepository` describes a generic interface that makes tasks available to the application, while `MemoryShoppingListRepository` describes a memory-based implementation. Although we don't need to use the suspend keyword here, we can ensure that we can easily migrate the project later after creating a database or network TodoRepository, and we can also simulate this delay by calling the delay() function. You can see that we store our list privately and only make it available through a function embedded in a `Flow`.

!!!info "Flow"
    In *coroutines*, [Flow](https://developer.android.com/kotlin/flow) is a type that can return multiple values ​​in a row, as opposed to functions that only return a single value. With *Flow*, we can continuously monitor a data source and get live updates from, for example, a database.

### Initializing the repository

We've just created our *repository*, but nothing has instantiated it and made it available to us yet. There are several options for solving this problem. We now choose to bind our *repository* to our *application object*. This way, it will always exist when the application is running and will be accessible from anywhere. Let's create a `ShoppingListApplication.kt` file in our project's base *package*, and then initialize our *repository in it:

`ShoppingListApplication.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist

import android.app.Application
import hu.bme.aut.android.shoppinglist.data.repository.IShoppingItemRepository
import hu.bme.aut.android.shoppinglist.data.repository.MemoryShoppingItemRepository

class ShoppingListApplication : Application() {

    companion object {
        lateinit var repository: IShoppingItemRepository
    }

    override fun onCreate() {
        super.onCreate()

        repository = MemoryShoppingItemRepository()
    }
}
```

!!!info "static"
    A big difference between Kotlin and other familiar OOP languages ​​is that it does not have the `static` keyword, and thus there are no static variables or functions. Instead, for each class, you can define a [`companion object`](https://kotlinlang.org/docs/reference/object-declarations.html#companion-objects), which defines a singleton that is accessible to all instances of the class. In short, every constant, variable, and function defined within a `companion object` behaves as if it were static.

After creating the *appilication* class, let's set it in `AndroidManifest.xml` to use our own instead of the default:

```xml
<application
    android:name=".ShoppingListApplication"
	...
```

### Creating the ViewModel

This way, we can access our *repository* anytime, anywhere, but it wouldn't be nice if the *screen*s accessed the *repository* directly, and the list would still be stored in the *screen* class. Let's introduce a `ShoppingListViewModel` to store this state. In addition to `ShoppingListScreen`, we create the *viewModel* in the `hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist` *package*:

???success "viewModel"
    To use the *viewModel* framework, we will need a dependency. Let's add the following to our project:

    `libs.versions.toml` added already:

	```toml
	[versions]
	viewModel = "2.9.4"
	...

	[libraries]
	androidx-lifecycle-viewmodel-compose = {group = "androidx.lifecycle", name="lifecycle-viewmodel-compose", version.ref = "viewModel" }
	...
	```

	Modul level `build.gradle.kts`:

	```kotlin
	dependencies {
		implementation(libs.androidx.lifecycle.viewmodel.compose)
		...
	```

`ShoppingListViewModel.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.ui.screen.shoppinglist

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import hu.bme.aut.android.shoppinglist.ShoppingListApplication
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem
import hu.bme.aut.android.shoppinglist.data.repository.IShoppingItemRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch


class ShoppingListViewModel(
    private val repository: IShoppingItemRepository
) : ViewModel() {
    private val _list = MutableStateFlow<List<ShoppingItem>>(listOf())
    val shoppingItemList = _list.asStateFlow()

    init {
        getAllItems()
    }

    fun getAllItems() {
        viewModelScope.launch {
            repository.getAllItems().collectLatest {
                _list.tryEmit(it)
            }
        }
    }

    fun insert(item: ShoppingItem) {
        viewModelScope.launch {
            try {
                repository.insert(shoppingItem = item)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun update(item: ShoppingItem) {
        viewModelScope.launch {
            try {
                repository.update(shoppingItem = item)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun delete(item: ShoppingItem) {
        viewModelScope.launch {
            try {
                repository.delete(shoppingItem = item)
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = viewModelFactory {
            initializer {
                ShoppingListViewModel(repository = ShoppingListApplication.repository)
            }
        }
    }
}
```

You can see that `ShoppingListViewModel` has taken over the storage of the list (i.e. the current state) and provides access to some functions of the *repository*. It calls these functions in its own *viewModelScope*, on a background thread, without blocking.

Since the *viewModel* can outlive the component that created it, we will not create the instance by calling the constructor in the code, but we can pass a special factory method to the framework, which the system will call the first time. We have organized this method into the *companion object* part, which currently only creates an instance, but may be useful later for initializing various external values.

### Using the ViewModel

Now we can replace the part of the `ShoppingListScreen` implementation where the list is initialized with a `ShoppingListViewModel`. To do this, we pass the *ViewModel* in the `ShoppingListScreen` constructor. Once we have it, we replace the *onCheckBoxClick* and the *onSaveClick* event handlers of the dialog box:

```kotlin
@Composable
fun ShoppingListScreen(

    modifier: Modifier = Modifier,
    viewModel: ShoppingListViewModel = viewModel(factory = ShoppingListViewModel.Factory)
) {

    val list = viewModel.shoppingItemList.collectAsStateWithLifecycle().value
    var isDialogOpen by remember { mutableStateOf(false) }

    Scaffold(
        ...
    ) { innerPadding ->

        LazyColumn(
            modifier = Modifier.padding(innerPadding)
        ) {
            items(list, key = { item -> item.id!! }) {

                UIShoppingItem(
                    shoppingItem = it,
                    onCheckBoxClick = { shoppingItem ->
                        viewModel.update(shoppingItem)
                    },
                    ...

	if (isDialogOpen) {
        Dialog(onDismissRequest = { isDialogOpen = false }) {
            ShoppingItemDialog(
                onDismissRequest = { isDialogOpen = false },
                onSaveClick = { newShoppingItem ->
                    viewModel.insert(newShoppingItem)
                }
            )
        }
    }

	...
```

Notice how we collect the shopping list from the *viewModel* as state!

Let's try the application!

Now, if we click on the *CheckBox* or add a new item to our list, it will appear on the interface within a short time (1000ms delay). What we are actually doing is that, as a result of the interaction performed on the *screen*, we manipulate our list in the *repository* with *coroutines* (on a background thread) through the *viewModel*. If this *repository* could access the data from a persistent store, our application would already be ready.

We can also observe that our list now survives rotations, as it is no longer stored in *screen*.

!!!example "BEADANDÓ (1 point)"
    Create a **screenshot** showing the **list with multiple items** (on an emulator, mirroring the device or with a screenshot), the **ShoppingListViewModel code**, and your **neptun code as a product name**! Upload the image to the repository in the solution as **f2.png**!

A screenshot is required to get a score.

## Implementing Persistent Data Storage (1 point)

We will use the `Room` library to store data persistently.

!!!info "Room"
    [`Room`](https://developer.android.com/training/data-storage/room/) provides a convenient database management API on top of the platform-wide SQLite implementation. It saves you from writing a lot of the code you saw before, such as the *Table classes that contain the table data and the creation script, the DBHelper, and the PersistentDataHelper*. These and other helper classes are generated by `Room` using *annotation*-based code generation as part of the *build* process.


???success "Adding Room to Project"
    First, open the `libs.versions.toml` file and enter the following: 

	`libs.versions.toml` added already:

	```toml
	[versions]
    ...
	ksp = "2.2.10-2.0.2"
	room = "2.8.2"

	[libraries]
	...
	androidx-room-runtime = {group = "androidx.room", name="room-runtime", version.ref= "room" }
	androidx-room-compiler = {group = "androidx.room", name="room-compiler", version.ref= "room" }
	androidx-room-ktx = {group = "androidx.room", name="room-ktx", version.ref= "room" }

	[plugins]
	...
	google-devtools-ksp = { id = "com.google.devtools.ksp", version.ref="ksp"}
	```

	Next, we enable the use of the [Kotlin Symbol Processing API](https://kotlinlang.org/docs/ksp-overview.html) in the project-level `build.gradle.kts` file:

	Project level `build.gradle.kts` added already:

	```kotlin
	plugins {
	    ...
	    alias(libs.plugins.google.devtools.ksp) apply false
	}
	```

	Then enable *KSP* in the `build.gradle.kts` file for the app module and add the dependencies:

	Modul level `build.gradle.kts` added already:

	```kotlin
	plugins {
		...
	    alias(libs.plugins.google.devtools.ksp)
	}
	...
	dependencies {
	    ksp(libs.androidx.room.compiler)
	    implementation(libs.androidx.room.runtime)
	    implementation(libs.androidx.room.ktx)
		...
	}
	```

    Then click the **Sync Now** button in the upper right corner.

### Creating the model class

The essence of ORM is that we can store objects in a database, which means we need a model class. So far, we have been using the previously created `ShoppingItem` class to store our data throughout the entire project. Fortunately, by switching to `Room`, we don't have to throw it away completely, we can continue to use it with minor modifications. So let's complete our `ShoppingItem` class:

`ShoppingItem.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.data.entities

import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;
import androidx.room.TypeConverter

@Entity(tableName = "shoppingItem")
data class ShoppingItem(
    @ColumnInfo(name = "id") @PrimaryKey(autoGenerate = true) var id: Long? = null,
    @ColumnInfo(name = "name") var name: String,
    @ColumnInfo(name = "description") var description: String,
    @ColumnInfo(name = "category") var category: Category,
    @ColumnInfo(name = "estimatedPrice") var estimatedPrice: Int,
    @ColumnInfo(name = "isBought") var isBought: Boolean
) {
    enum class Category {
        FOOD, ELECTRONIC, BOOK;

        companion object {
            @JvmStatic
            @TypeConverter
            fun getByOrdinal(ordinal: Int): Category? {
                var ret: Category? = null
                for (cat in values()) {
                    if (cat.ordinal == ordinal) {
                        ret = cat
                        break
                    }
                }
                return ret
            }

            @JvmStatic
            @TypeConverter
            fun toInt(category: Category): Int {
                return category.ordinal
            }
        }
    }
}
```

You can see that we have placed annotations on the class, the variables of the class, and the functions of the enum class within the class. `@Entity` indicates to the *Room* code generator that the instances of this class will correspond to database records in a table and that its individual variables will correspond to the columns of the table. With the `@ColumnInfo` annotation, we specify the name of the column corresponding to the member variable. With `@PrimaryKey` we mark the primary key attribute of the table.

We have also created an *enum* in the class, with which we want to encode a category. *enum* has two static methods, annotated with `@TypeConverter`. These can be used to allow the database to store even complex data structures. These functions are responsible for translating a user-defined type to a type supported by the database, and vice versa.

It can also be observed that these functions are also provided with the `@JvmStatic` annotation. This is necessary because basically, when the *companion objects* are converted to *Jvm* bytecode, a separate static class is created for them. This annotation can be used to specify that a separate static class should not be created, but instead they should be static functions of the enclosing class (in this case *Category*). This special behavior is necessary because of the way *Room* works, as it needs to know where to look for converters for a type.


### Creating a DAO class

!!!info "DAO"
    DAO = [Data Access Object](https://en.wikipedia.org/wiki/Data_access_object)

In the `hu.bme.aut.android.shoppinglist.data` *package*, create a new *package* named `dao`, and then create a new Kotlin *interface* inside it called `ShoppingItemDao`:

`ShoppingItemDao.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.data.dao

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.Query
import androidx.room.Update
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem
import kotlinx.coroutines.flow.Flow

@Dao
interface ShoppingItemDao {

    @Query("SELECT * FROM shoppingitem")
    fun getAll(): Flow<List<ShoppingItem>>

    @Insert
    suspend fun insert(item: ShoppingItem)

    @Update
    suspend fun update(item: ShoppingItem)

    @Delete
    suspend fun delete(item: ShoppingItem)
}
```

An *interface* with an `@Dao` annotation indicates to the `Room` code generator that an implementation for the *interface* must be generated that implements the *interface* functions based on the annotations (`@Query`, `@Insert`, `@Update`, `@Delete`) on them.

Note that Android Studio also provides code completion and error reporting for the *SQLite script* passed as a parameter to the `@Query` annotation!

### Creating the database class

In the `hu.bme.aut.android.shoppinglist.data` *package*, create a new *package* called `database`, and then a new Kotlin class in it called `ShoppingListDatabase`:

`ShoppingListDatabase.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import hu.bme.aut.android.shoppinglist.data.dao.ShoppingItemDao
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem

@Database(entities = [ShoppingItem::class], version = 1)
@TypeConverters(value = [ShoppingItem.Category::class])
abstract class ShoppingListDatabase : RoomDatabase() {
    abstract val shoppingItemDao: ShoppingItemDao
}
```
The `@Database` annotation can be used to indicate to the code generator that a class will represent a database. Such a class must be *abstract* and must be derived from `RoomDatabase`. The `entities` parameter of the annotation must be passed a list containing the classes marked with `@Entity` corresponding to the database tables. The `version` parameter value is the local database version. The `@TypeConverters` annotation can be used to list our converters for each complex type.

The `ShoppingListDatabase` class is also responsible for the availability of the corresponding DAO classes.

### Creating the repository

Now that we have the database, we can create our *repository* that accesses it, similar to `MemoryShoppingItemRepository`. So let's create a `RoomShoppingItemRepository` class in the `hu.bme.aut.android.shoppinglist.data.repository` *package*, which takes the *DAO* as a parameter and implements the `IShoppingItemRepository` *interface*.

`RoomShoppingItemRepository.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist.data.repository

import hu.bme.aut.android.shoppinglist.data.dao.ShoppingItemDao
import hu.bme.aut.android.shoppinglist.data.entities.ShoppingItem
import kotlinx.coroutines.flow.Flow

class RoomShoppingItemRepository(private val dao: ShoppingItemDao) : IShoppingItemRepository {

    override fun getAllItems(): Flow<List<ShoppingItem>> = dao.getAll()
    override suspend fun insert(shoppingItem: ShoppingItem) = dao.insert(shoppingItem)
    override suspend fun update(shoppingItem: ShoppingItem) = dao.update(shoppingItem)
    override suspend fun delete(shoppingItem: ShoppingItem) = dao.delete(shoppingItem)
}
```

### Initializing the repository

We are now completely ready to implement the database. We just need to instantiate it somewhere and replace the `MemoryShoppingItemRepository` that we have been using to access the data so far. Let's do this in our *application* class:

`ShoppingListApplication.kt`:

```kotlin
package hu.bme.aut.android.shoppinglist

import android.app.Application
import androidx.room.Room
import hu.bme.aut.android.shoppinglist.data.repository.IShoppingItemRepository
import hu.bme.aut.android.shoppinglist.data.repository.RoomShoppingItemRepository
import hu.bme.aut.android.shoppinglist.data.database.ShoppingListDatabase

class ShoppingListApplication : Application() {

    companion object {

        lateinit var repository: IShoppingItemRepository

        private lateinit var database: ShoppingListDatabase
    }

    override fun onCreate() {
        super.onCreate()

        database = Room.databaseBuilder(
            applicationContext,
            ShoppingListDatabase::class.java,
            "shoppinglist_database"
        ).fallbackToDestructiveMigration(false).build()

        repository = RoomShoppingItemRepository(database.shoppingItemDao)

        //repository = MemoryShoppingItemRepository()
    }
}
```

Let's try the application!

Our application is now able to record items and save them.

In the previous task, we not only implemented persistent storage, but also created an architecturally well-thought-out application. This is also supported by the fact that in order for our data to be stored not only in memory, but also in a database, we only had to write the implementation parts for the *Room* database and initialize the appropriate *repository*. We did not have to change either the *viewModel* or the *screen*.

!!!example "TO BE SUBMITTED (1 point)"
    Create a **screenshot** showing the **shopping list with multiple items** (on an emulator, mirroring the device or with a screenshot), the **`RoomShoppingListRepository` code**, and your **neptun code as a product name**! Upload the image to the repository in the solution as **f3.png**!

The screenshot is a necessary condition for obtaining a score.

## Independent task: implementing deletion (1 point)

Implement the deletion of items one by one, by clicking on the trash icon on the items!

???success "Solution"
        - Implementing the button event handler in `ItemShoppingItem`
        - Implementing the deletion *callback* on `ShoppingListScreen`

!!!example "TO BE SUBMITTED (1 point)"
    Create a **screenshot** showing the **empty list** (on emulator, device mirroring or with a screenshot), a **code snippet for deletion**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as **f4.png**!

    The screenshot is a necessary condition for obtaining a score.

## Independent task: confirmation dialogue (1 point)

Implement a *Delete all* menu item and its associated function!

The application should display a confirmation dialog when the user clicks on the *Delete all* menu item. The dialog should contain a short text warning that all items will be deleted, a positive and negative button (*OK* and *Cancel*). When the positive button is pressed, only the items should be deleted.

!!!example "TO BE SUBMITTED (1 iMSc point)"
    Create a **screenshot** showing the **confirmation dialog** (on an emulator, by mirroring the device or by taking a screenshot), a **corresponding code snippet**, and your **neptun code somewhere in the code as a comment**! Upload the image to the repository in the solution as **f5.png**!

    The screenshot is a required condition for getting a score.

## Bonus task: editing elements

Create the ability to edit list items!

The edit button on the list item should open the previously implemented entry dialog, and the input fields should be pre-filled with the saved values. The *Save* button should modify the existing list item in both the database and the view.
---
layout: post
title:  "Packages in Python: The Basics"
description: "Packages are a major concept in Python. Ever wondered how you can plug and play any Python library through PiP (Python Package Index)? All of this works by
using Python packages, a useful tool not only to be able to distribute your application to others, but as well to improve overall code quality."
image: /assets/images/05-packages/banner.png
category: python
tags: [Python]
---

# {{ page.title }}

Ever wondered how you can easily plug and play a Python library into your project? Let's take as an example the
scikit-learn library, which we can in a glimpse import many scientific tools (such as ML algorithms, data preprocessing, etc).

But how does this work behind the scenes?

First of all, we need to have the definition of what is a package:

A package is a collection of modules. And a module is a piece of software with a specific purpose/functionality. Returning back to scikit-learn example, it is composed of several modules, such as:

- sklearn.ensemble: modules to perform model ensembling
- sklean.metrics: modules to generate metrics for trained models (R2, MSE, MAE, etc)
- sklearn.neural_network: modules related to neural network usage

### Benefits of using modules and packages

- Distributability: you can easily distribute your source code to others via PiP (Python Package Index). Remember pip install <package_name>?
- Modularity: it allows you to write a given package once, and then use it elsewhere without the need of copying and pasting over and over again - consequently improving code quality.
- Simplicity: instead of creating a big blob file, you decompose your code into smaller pieces that fit together. This leads to a better comprehension of the smaller pieces of the big picture.
- Reusability: by using a module, we avoid the need to duplicate our code, once we are always looking at a single place.
- Scope: modules and packages allows us to define scope boundaries, so we clearly can see where one given component belongs to.

### Your first package

In order to create your first package, just create a new folder with the name of your package and a \_\_init\_\_.py file on the root of where the folder is located.
For the package name, the naming convention is **name_with_underscores**, so if you are creating a package that is responsible for text processing, a good name for it would be **text_processing**.

So your file structure would look like the following:

    /working_directory
        my_script.py
        /text_processing
            cleaning.py
            __init__.py
    
In the file cleaning.py (located at working_directory/text_processing), we will define a function to remove any trailing whitespaces from a given string, as follows:

```python
def remove_undesired_whitespaces(text: str) -> str:
    """
    Removes trailing whitespaces from a given string.
    
    :param text: the text to be cleaned
    :return: the cleaned text without trailing whitespaces
    
    >>> remove_undesired_whitespaces('  Hey there!   ')
    Hey there!
    """
    return text.strip()
```

And in the file my_script.py (located at working_directory), we could use our recently created package with the following code:

```python
# Import our recently created module to cleanup text
import text_processing.cleaning

dirt_text = '    Text with whitespaces on begin and end    '
clean_text = text_processing.cleaning.remove_undesired_whitespaces(dirt_text) 

print(clean_text)

# output: 'Text with whitespaces on begin and end'
```

This is the most basic usage of a package, pretty simple huh?. But it seems a little bit redundant on the whole import and method invocation section, doesn't it? We can then rely on the \_\_init\_\_.py file to solve this:

### The init file

What is the purpose of the \_\_init\_\_.py?

1 - Initialization: let's you have a logging class, which should interact with a database. You would probably like this to be initialized as soon as possible, right? Here we can rely on
the \_\_init\_\_.py file, once we will be sure that our code will be executed.

2 - Convenience: most of the time, third-party users don't need to know about the internals of a given library. For these scenarios, we can use the \_\_init\_\_.py to make
it easier for them to import the most important files without having to know their exact locations.

So inside our \_\_init\_\_.py file (located at working_directory/text_processing), we will write the following code:

```python
# Import the function remove_undesired_whitespaces from the cleaning file inside our package directory
from .cleaning import remove_undesired_whitespaces
```




And then on the my_script.py file (located at working_directory), we can directly call our remove_undesired_whitespaces method:

```python
import text_processing

dirt_text = '    Text with whitespaces on begin and end    '

print(text_processing.remove_undesired_whitespaces(dirt_text))

# same output, just a cleaner way of writing
```

That's it! You have successfully created your first Python package. In the following posts we will be covering how to make your package available through PiP. Until the next!
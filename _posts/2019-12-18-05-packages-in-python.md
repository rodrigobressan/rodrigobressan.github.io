---
layout: post
title:  "Packages in Python: The Basics"
description: ""
image: /assets/images/05-packages-in-python/banner.png
category: python
tags: [Python]
---

# {{ page.title }}

Ever wondered how you can easily plug and play a Python library onto your project? Let's take as an example the
scikit-learn library, which we can in a glimpse import many scientific tools such as machine learning algorithms.

But how does this work?

First of all, we need to have the definition of what is a package:

A package is a collection of modules. And a module is a piece of software with a specific purpose/functionality. Returning back to scikit-learn example, we have several modules, such as:

- sklearn.ensemble: modules to perform model ensembling
- sklean.metrics: modules to generate metrics for trained models (R2, MSE, MAE, etc)
- sklearn.neural_network: modules related to neural network usage

This is just a quick example of packages, I am sure you got the idea.

# Benefits of using packages

- Distributable: you can easily distribute your source code to others via PiP (Python Package Index). Remember pip install <package_name>? That's what I am talking about.
- Modularity: it allows you to write a given package once, and then use it elsewhere without the need of copying and pasting over and over again.

# Creating your first package

In order to create your first package, just create a new folder with the name of your package and a \_\_init\_\_.py file on the root of where the folder is located.
For the package name, the Python community follows the convention **name_with_underscores**, so if you are creating a package that is responsible for text processing, it would be named **text_processing**.

So your file structure would look like the following:


    - working_directory
        - my_script.py
        - text_processing
            - cleaning.py
            - __init__.py
    
In the file cleaning.py (located in working_directory/text_processing), we would have the following code:

```python
def remove_undesired_whitespaces(text):
    return text.strip()
```

And in the file my_script.py (located in working_directory), we would use our recently created package with the following code:

```python
import text_processing.cleaning

dirt_text = '    Text with whitespaces on begin and end    '

print(text_processing.cleaning.remove_undesired_whitespaces(dirt_text))

# outputs: 'Text with whitespaces on begin and end'
```

This is a basic usage of a package. But it seems a little bit redundant on the whole import section (import text_processing.cleaning), doesn't it? We can then rely on the \_\_init\_\_.py file to solve this:

# Importing with the \_\_init\_\_.py file

Inside our \_\_init\_\_.py file (located at working_directory/text_processing):

```python
from .cleaning import remove_undesired_whitespaces
```

And then on our my_script.py file (located at working_directory), we can directly call our remove_undesired_whitespaces method:

```python
import text_processing

dirt_text = '    Text with whitespaces on begin and end    '

print(text_processing.remove_undesired_whitespaces(dirt_text))

# same output, just a cleaner way of writing
```


That's it, if you got until here, you should already have some good idea on how to create Python packages and use it over your project.

Any doubts? Feel free to ask!



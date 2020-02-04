---
layout: post
title:  "Software Engineering for Data Scientists 01: Testing ML models with PyTest"
description: "Automated tests are a major backbone in any software development pipeline, and this happens due to the
fact that we can easily avoid manually testing our piece of code, and instead of this, make our
own code test itself. I am sure that if you are interested in building high quality ML models, you
will have interest in automated testing your trained models. And before you think this may be a 
complicated task, we will see how easily it is to setup an automated test pipeline."
image: /assets/images/06-tests/banner.png
category: software-engineering
tags: [Software Engineering, DevOps, Unit Testing, Python]
---

# {{ page.title }}

{{ page.description }}

### What is Automated Testing

As the name says, automated testing is basically testing a piece of application without the need of doing it manually. The major benefits are the following:

1) Ensure that all the executions are exactly the same, in the same environment (no more *"it works on my machine, I swear!"*)

2) Run tests way faster: let's say that you have one thousand models in your pipeline. Running one by one for sure is not the best way to spend your time.

3) Discover earlier about model's malfunctioning, avoiding deploying it by accident into production

Sounds good enough, doesn't it?

### Testing our models

In order to test our models, we need to create a directory called *tests* on the root of the project. In case you have many modules on your project, you can use the *MODULENAME_tests* convention.
Our project would then have the following structure:

    /my_project_folder
        train_model.py
        /tests
            test_trained_model.py

Inside the *train_model.py* file we will place the following piece of code:

```python
from sklearn.linear_model import LinearRegression
from sklearn.externals import joblib
import numpy as np


def train_dummy_model():
    print('Training dummy model')

    X_train = np.array([1, 3, 5, 7, 9]).reshape(-1, 1)
    y_train = np.array([10, 30, 50, 70, 90]).reshape(-1, 1)

    # train our model
    model = LinearRegression()
    model.fit(X_train, y_train)

    joblib.dump(model, 'trained_dummy_model.sav')
```

This code just inputs some features and targets into our model, in which the output is the input multiplied by 10.

And then we create our file to test our model, which we will call *test_train_model.py*. This file will contain the necessary
functions to load our already trained model, as well as two separate functions to test both positive and negative inputs against our model.

```python
from sklearn.externals import joblib
from sklearn.metrics import r2_score
import numpy as np

def test_prediction_positive_values():
    model = joblib.load('trained_dummy_model.sav')

    X_test = np.array([2, 4, 6, 8, 10, 50]).reshape(-1, 1)
    y_test = np.array([20, 40, 60, 80, 100, 500]).reshape(-1, 1)

    y_preds = model.predict(X_test)
    r2 = r2_score(y_test, y_preds)

    assert r2 == 1


def test_prediction_negative_values():
    model = joblib.load('trained_dummy_model.sav')

    X_test = np.array([-2, -4, -6, -8, -10, -50]).reshape(-1, 1)
    y_test = np.array([-20, -40, -60, -80, -100, -500]).reshape(-1, 1)

    y_preds = model.predict(X_test)
    r2 = r2_score(y_test, y_preds)

    assert r2 == 1

```

And finally run our tests with the **pytest** comand on the terminal.

```bash
pytest
```

Voilà! And then PyTest will proceed to run all our unit tests. You should probably see the following output:

```
2 passed, 2 warnings in 1.24s
```

As we can see, our tests took a total amount of 1.24s. We spent around 3 minutes to write our test cases, which now we can easily
reproduce by just running the pytest command, without the need to manually test our inputs.


### Conclusions

With this example, we can see how adopting tests on our ML pipelines can be useful, once it allows us to write our tests only once, making it easy to test our trained models and easier to spot any kind of model malfunctioning.
Of course this is just a silly example, but we can use this approach to test more complex applications, such as image classification, sentiment analysis, along as many other ML models.

The whole source code for this project can be found <a href='https://github.com/rodrigobressan/testing-ML-models-with-pytest'>here</a>.

I hope you liked this post, and in the following posts we will be covering many other tools to improve our projects. See you next time!

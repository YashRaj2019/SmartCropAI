import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from .features import NUMERICAL_FEATURES, CATEGORICAL_FEATURES

def build_preprocessing_pipeline() -> ColumnTransformer:
    """
    Builds a reproducible preprocessing pipeline for numerical and categorical features.
    """
    num_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    cat_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='most_frequent')),
        ('encoder', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_transformer, NUMERICAL_FEATURES),
            ('cat', cat_transformer, CATEGORICAL_FEATURES)
        ]
    )

    return preprocessor

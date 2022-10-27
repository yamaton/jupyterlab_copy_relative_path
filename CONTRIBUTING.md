## Development

```shell
## Ref: https://github.com/jupyterlab/extension-examples

# create a conda environment
mamba env create && conda activate copyrelativepath

# install the extension in editable mode
python -m pip install -e .

# install your development version of the extension with JupyterLab
jupyter labextension develop . --overwrite

# build the TypeScript source after making changes
jlpm run build

# start JupyterLab
jupyter lab --watch

```
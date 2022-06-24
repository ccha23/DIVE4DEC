#!/bin/bash
usage() { echo "Usage: $0 [bitfusion_run_opts] [-- jupyter_opts] " 1>&2; exit 1; }

JUPYTER_OPTS=()
BITFUSION=('bitfusion' 'run')

while [ $# -gt 0 ]; do
    case $1 in
        -h|--help)
            usage
            ;;
        --)
            shift
            break
            ;;
        *)
            BITFUSION+=("$1")
            shift;;
    esac
done

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

set -e

# set default ip to 0.0.0.0
if [[ "${NOTEBOOK_ARGS} $*" != *"--ip="* ]]; then
    NOTEBOOK_ARGS="--ip=0.0.0.0 ${NOTEBOOK_ARGS}"
fi

# shellcheck disable=SC1091,SC2086
. /usr/local/bin/start.sh "${BITFUSION[@]}" jupyterhub-singleuser ${NOTEBOOK_ARGS} "$@"

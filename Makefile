PRIVATE_REG=localhost:32000
PUBLIC_REG=chungc
VERSION=0.0.0

.PHONY: jsxgraph-mathjax3 scipy-nv

jsxgraph-mathjax3:
	docker build --pull \
				 -t "${PRIVATE_REG}/jsxgraph-mathjax3" -f jsxgraph-mathjax3/Dockerfile .
	# docker push "${PRIVATE_REG}/jsxgraph-mathjax3"

scipy-nv:
	docker build --pull \
				 --build-arg ROOT_CONTAINER="nvidia/cuda:11.2.2-cudnn8-runtime-ubuntu20.04" \
				 --build-arg PYTHON_VERSION="3.10" \
				 -t "${PRIVATE_REG}/base-notebook-nv" docker-stacks/base-notebook
	docker push "${PRIVATE_REG}/base-notebook-nv"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/base-notebook-nv" \
				 -t "${PRIVATE_REG}/minimal-notebook-nv" docker-stacks/minimal-notebook
	docker push "${PRIVATE_REG}/minimal-notebook-nv"
	docker build --pull \
			 	 --build-arg BASE_CONTAINER="${PRIVATE_REG}/minimal-notebook-nv" \
				 -t "${PRIVATE_REG}/scipy-notebook-nv" docker-stacks/scipy-notebook
	docker push "${PRIVATE_REG}/scipy-notebook-nv"

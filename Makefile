PRIVATE_REG=localhost:32000
PUBLIC_REG=chungc
VERSION=0.0.0

.PHONY: jsxgraph-mathjax3 scipy-nv remote-display jupyter-interface programming tex math datamining grading deploy

jsxgraph-mathjax3:
	docker build --pull \
				 -t "${PRIVATE_REG}/jsxgraph-mathjax3" -f jsxgraph-mathjax3/Dockerfile .

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

remote-display:
	docker build --pull \
				 -t "${PRIVATE_REG}/remote-display" -f remote-display/Dockerfile .

jupyter-interface:
	docker build --pull \
				 -t "${PRIVATE_REG}/jupyter-interface" -f jupyter-interface/Dockerfile .

programming:
	docker build --pull \
				 -t "${PRIVATE_REG}/programming" -f programming/Dockerfile .

tex:
	docker build --pull \
				 -t "${PRIVATE_REG}/tex" -f tex/Dockerfile .

math:
	docker build --pull \
				 -t "${PRIVATE_REG}/math" -f math/Dockerfile .

datamining:
	docker build --pull \
				 -t "${PRIVATE_REG}/datamining" -f datamining/Dockerfile .

grading:
	docker build --pull \
				 -t "${PRIVATE_REG}/grading" -f grading/Dockerfile .

deploy: scipy-nv
	cd DIVE-deploy; \
	docker build --pull \
				 --build-arg ROOT_CONTAINER=scipy-nv \
				 -t "${PRIVATE_REG}/deploy" -f Dockerfile .
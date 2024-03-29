PRIVATE_REG=localhost:32000
PUBLIC_REG=chungc
VERSION=0.0.1

.PHONY: divewidgets jsxgraph-mathjax3 scipy-nv remote-display jupyter-interface programming tex math datamining grading deploy classic main divedeep

divewidgets:
	cd divewidgets; \
	docker build --pull \
				 -t "${PRIVATE_REG}/divewidgets" -f Dockerfile .

jsxgraph-mathjax3:
	docker build --pull \
				 -t "${PRIVATE_REG}/jsxgraph-mathjax3" -f jsxgraph-mathjax3/Dockerfile .

scipy-nv:
	docker build --pull \
				 --build-arg ROOT_CONTAINER="nvidia/cuda:11.2.2-cudnn8-runtime-ubuntu20.04" \
				 --build-arg PYTHON_VERSION="3.9" \
				 -t "${PRIVATE_REG}/base-notebook-nv" docker-stacks/base-notebook
	docker push "${PRIVATE_REG}/base-notebook-nv"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/base-notebook-nv" \
				 -t "${PRIVATE_REG}/minimal-notebook-nv" docker-stacks/minimal-notebook
	docker push "${PRIVATE_REG}/minimal-notebook-nv"
	docker build --pull \
			 	 --build-arg BASE_CONTAINER="${PRIVATE_REG}/minimal-notebook-nv" \
				 -t "${PRIVATE_REG}/scipy-nv" docker-stacks/scipy-notebook
	docker push "${PRIVATE_REG}/scipy-nv"

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

classic:
	docker build --pull \
				 -t "${PRIVATE_REG}/classic" -f classic/Dockerfile .

deploy: scipy-nv
	cd DIVE-deploy; \
	docker build --pull \
				 --build-arg ROOT_CONTAINER=scipy-nv \
				 -t "${PRIVATE_REG}/deploy" -f Dockerfile .

main: scipy-nv
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/scipy-nv" \
				 -t "${PRIVATE_REG}/main-s1" -f jupyter-interface/Dockerfile .
	docker push "${PRIVATE_REG}/main-s1"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main-s1" \
				 -t "${PRIVATE_REG}/main-s2" -f programming/Dockerfile .
	docker push "${PRIVATE_REG}/main-s2"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main-s2" \
				 -t "${PRIVATE_REG}/main-s3" -f tex/Dockerfile .
	docker push "${PRIVATE_REG}/main-s3"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main-s3" \
				 -t "${PRIVATE_REG}/main-s4" -f math/Dockerfile .
	docker push "${PRIVATE_REG}/main-s4"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main-s4" \
				 -t "${PRIVATE_REG}/main-s5" -f datamining/Dockerfile .
	docker push "${PRIVATE_REG}/main-s5"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main-s5" \
				 -t "${PRIVATE_REG}/main-s6" -f remote-display/Dockerfile .
	docker push "${PRIVATE_REG}/main-s6"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main-s6" \
				 -t "${PRIVATE_REG}/main-s7" -f grading/Dockerfile .
	docker push "${PRIVATE_REG}/main-s7"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main-s7" \
				 -t "${PRIVATE_REG}/main:${VERSION}" -f classic/Dockerfile .
	docker push "${PRIVATE_REG}/main:${VERSION}"
	cd DIVE-deploy; \
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/main:${VERSION}" \
				 -t "${PRIVATE_REG}/main-deploy:${VERSION}" -f Dockerfile .
	docker push "${PRIVATE_REG}/main-deploy:${VERSION}"

divedeep: scipy-nv
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/scipy-nv" \
				 -t "${PRIVATE_REG}/divedeep-s1" -f jupyter-interface/Dockerfile .
	docker push "${PRIVATE_REG}/divedeep-s1"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep-s1" \
				 -t "${PRIVATE_REG}/divedeep-s2" -f programming/Dockerfile .
	docker push "${PRIVATE_REG}/divedeep-s2"
	# docker build --pull \
	# 			 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep-s2" \
	# 			 -t "${PRIVATE_REG}/divedeep-s3" -f tex/Dockerfile .
	# docker push "${PRIVATE_REG}/divedeep-s3"
	# docker build --pull \
	# 			 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep-s3" \
	# 			 -t "${PRIVATE_REG}/divedeep-s4" -f math/Dockerfile .
	# docker push "${PRIVATE_REG}/divedeep-s4"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep-s2" \
				 -t "${PRIVATE_REG}/divedeep-s5" -f datamining/Dockerfile .
	docker push "${PRIVATE_REG}/divedeep-s5"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep-s5" \
				 -t "${PRIVATE_REG}/divedeep-s6" -f remote-display/Dockerfile .
	docker push "${PRIVATE_REG}/divedeep-s6"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep-s6" \
				 -t "${PRIVATE_REG}/divedeep-s7" -f grading/Dockerfile .
	docker push "${PRIVATE_REG}/divedeep-s7"
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep-s7" \
				 -t "${PRIVATE_REG}/divedeep:${VERSION}" -f classic/Dockerfile .
	docker push "${PRIVATE_REG}/divedeep:${VERSION}"
	cd DIVE-deploy; \
	docker build --pull \
				 --build-arg BASE_CONTAINER="${PRIVATE_REG}/divedeep:${VERSION}" \
				 -t "${PRIVATE_REG}/divedeep-deploy:${VERSION}" -f Dockerfile .
	docker push "${PRIVATE_REG}/divedeep-deploy:${VERSION}"
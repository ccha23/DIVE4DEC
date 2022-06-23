PRIVATE_REG=localhost:32000
PUBLIC_REG=chungc
VERSION=0.0.0

jsxgraph-mathjax3:
	docker build --pull \
				 -t "${PRIVATE_REG}/jsxgraph-mathjax3" -f jsxgraph-mathjax3/Dockerfile .
	# docker push "${PRIVATE_REG}/jsxgraph-mathjax3"
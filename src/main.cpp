#include <iostream>
#include <string>

#include <caideInliner.hpp>

int main(int argc, char **argv) {
  // arguments:
  // - filename
  // - temp directory
  // - number of clang compilation options
  // - each of the options
  // - max subsequent empty lines
  int ptr = 1;

  std::string source(argv[ptr++]);
  caide::CppInliner inliner(argv[ptr++]);
  int num_options = std::atoi(argv[ptr++]);
  for (int i = 0; i < num_options; ++i) {
    inliner.clangCompilationOptions.push_back(argv[ptr++]);
  }
  inliner.maxConsequentEmptyLines = std::atoi(argv[ptr++]);
  inliner.inlineCode(std::vector<std::string>{source}, std::cout);
}
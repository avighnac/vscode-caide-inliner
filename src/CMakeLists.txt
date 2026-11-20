cmake_minimum_required(VERSION 3.28)

project(caide-inliner LANGUAGES C CXX)

include(FetchContent)

set(CAIDE_USE_SYSTEM_CLANG ON CACHE BOOL "Use installed Clang and LLVM")
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

FetchContent_Declare(
  caide
  GIT_REPOSITORY https://github.com/slycelote/caide-cpp-inliner.git
  GIT_TAG 788fca91f0a05d362f3f28159edf88a8beea2bb7
  GIT_SUBMODULES ""
  SOURCE_SUBDIR src
  EXCLUDE_FROM_ALL
)
FetchContent_MakeAvailable(caide)

include_directories("${caide_SOURCE_DIR}/src")

add_executable(caide-inliner main.cpp)
target_compile_features(caide-inliner PRIVATE cxx_std_17)
target_link_libraries(caide-inliner PRIVATE caideInliner)
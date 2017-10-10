<template>
	<div class="job">
		<h2>New Job</h2>
		<form>
			<v-container grid-list-xl fluid>
				<v-layout row wrap>
			    	<v-flex xs12 sm6>
						<v-text-field
								label="Job Name"
								hint="A unique name to identify this job"
								single-line
								required
								/>
					</v-flex>
					<v-flex xs12 sm6>
						<v-select
						label="Account"
						:items="available.accounts"
						v-model="job.account"
						hint="Select the account to charge Job time to"
						persistent-hint
						required
						/>
					</v-flex>
				</v-layout>				
				<v-layout row wrap>
					<v-flex xs12 sm6>
						<v-text-field
								type="email"
								label="Email Address"
								hint="Recieve an email when job completes (optional)"
								single-line
								/>
					</v-flex>
					<v-flex xs12 sm6>
						<v-select
								label="Email Events"
								:items="available.emailEvents"
								v-model="job.emailEvents"
								autocomplete
								multiple
								chips
								hint="Select which events will generate an email"
								persistent-hint
								clearable
								/>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						<h5 class="form-title">Partitions</h5>
						<p>Select a partition from the list below</p>
						<v-container fluid grid-list-xs>
				            <v-layout row wrap>
								<v-flex xs12 sm4 md4 lg3 v-for="partition in available.partitions" :key="partition.id">
									<v-card :class="{ 'selected-card' : partition.id == job.partition }" 
											class="partition-card" 
											@click="setSelectedPartition(partition.id)"
											>
										<v-card-title primary-title >
											<v-icon v-if="partition.id == job.partition" class="green--text">fa-check-circle-o</v-icon>
											<v-icon v-else>fa-circle-o</v-icon>
											<h5 class="pa-0 ma-0 ml-4">{{partition.name}}</h5>
										</v-card-title>
										<div class="px-3 py-1">
											<p class="text-xs-center">Max Run Time: 2 days</p>
										</div>
										<div class="px-3 py-1">
											<div>
												{{partition.cpuCount}} CPUs
												<div v-tooltip:top="{ html: `${100 -partition.cpuUsage}% Free` }">
													<v-progress-linear height="10" :value="partition.cpuUsage"  error />	
												</div>
											</div>
											<div>						
												{{partition.memCount}}GB Memory
												<div v-tooltip:top="{ html: `${100 - getUsagePercent(partition.memCount, partition.memUsage)}% Free` }">
													<v-progress-linear height="10" 
																	   :value="getUsagePercent(partition.memCount, partition.memUsage)"  
																	   error
																	   />
												</div>
											</div>
										</div>
									</v-card>
								</v-flex>
							</v-layout>
						</v-container>
					</v-flex>
				</v-layout>
				 <v-layout row wrap>
				 	<v-flex xs12 sm6>
				 		<v-switch label="Advanced Settings" 
				 				  v-model="advancedSettings"
				 				  hint="Toggle for parallelization parameters"
				 				  :color="advancedSettings ? 'white' : ''"
				 				  persistent-hint
				 				  />
				 	</v-flex>
				 </v-layout>
				 <!-- lewis general biocompute GPU   | get node usage of lewis -->
				 <v-layout row wrap v-show="!advancedSettings">
				 	<v-alert info value="true">
				 		To run a multithreaded job on a single node, specify below the number of cores you want to allocate. Make sure that you set your program's parallel option to the same value.
				 	</v-alert>
					<v-flex xs12 sm6>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="CPU / Cores"
								value="1"
								hint="Number of cores to run on each node"
								required
								/>
						</div>
					</v-flex>
					<v-flex xs12 sm6>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Memory / RAM"
								value="2"
								suffix="GB"
								hint="Memory (in Gigabytes) to accocate to your job"
								required
								/>
						</div>
					</v-flex>
				</v-layout>
				<v-layout row wrap v-show="advancedSettings">
					<v-alert error value="true">
						Do not use tasks to ask for multiple cpus except for MPI programs. Other than MPI, there are almost no cases where this does what you want.
					</v-alert>
					<v-alert info value="true" class="my-3">
						Programs that are either sequential, using only one cpu, or multi-threaded, using multiple cpus, can only run on a single node. Allocating cpus on multiple nodes will not speed up programs that can't make use of them. Unless you know that your program has been architected to use multiple nodes (e.g. MPI), don't allocate multiple nodes.
					</v-alert>
				 	<v-flex xs12 sm6>
					 	<div class="pa-2">
							<v-text-field
								type="number"
								label="Nodes"
								value="1"
								hint="Number of nodes (machines) this job will run on"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Tasks per Node"
								value="1"
								hint="Number of Tasks per Node"
								required
								/>
						</div>
					</v-flex>
					<v-flex xs12 sm6>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="CPU / Cores"
								value="1"
								hint="Number of cores to run on each node"
								required
								/>
						</div>
						<div class="pa-2">
							<v-text-field
								type="number"
								label="Memory / RAM"
								value="2"
								suffix="GB"
								hint="Memory (in Gigabytes) to accocate to your job"
								required
								/>
						</div>
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						<v-select
								label="Modules to Load"
								:items="available.modules"
								v-model="job.modules"
								autocomplete
								multiple
								chips
								hint="Select the modules (software dependancies) needed to run your job"
								persistent-hint
								clearable
								/>
					</v-flex>
					<v-flex xs12 md8>
						<p>Enter commands to run. Existing scripts can be coppied or drag-and-dropped into the box below.</p>
					</v-flex>
					<v-flex xs12 md4>
						<v-select label="Markup Editor"
								  :items="editorLang"
								  v-model="editorOptions.keyMap"
								  />
					</v-flex>
				</v-layout>
				<v-layout row wrap>
					<v-flex xs12>
						<codemirror v-model="job.code" :options="editorOptions" />
					</v-flex>
				</v-layout>
			</v-container>
		</form>
	</div>
</template>


<script>
import { codemirror, CodeMirror } from 'vue-codemirror'
require('codemirror/keymap/sublime.js')
require('codemirror/keymap/vim.js')
require('codemirror/keymap/emacs.js')
require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/dialog/dialog.js')
import('codemirror/addon/dialog/dialog.css')

export default {
  
  name: 'new-job',

  components: {
    codemirror
  },

  data () {
	return {

		available: {

			partitions: [

				{	
					id: 'general',
					name: 'General',
					cpuCount: '24', 
					cpuUsage: '68', 
					memCount: '122', 
					memUsage: '0.63', 
					limit: '2:00:00'
				},
				{
					id: 'bonus',
					name: 'Bonus',
					cpuCount: '12', 
					cpuUsage: '0', 
					memCount: '74', 
					memUsage: '1.09', 
					limit: '2:00:00'
				},
				{
					id: 'gpu',
					name: 'GPU',
					cpuCount: '20', 
					cpuUsage: '0', 
					memCount: '122', 
					memUsage: '20.49', 
					limit: '2:00:00'
				},
				{
					id: 'biocompute',
					name: 'BioCompute',
					cpuCount: '56', 
					cpuUsage: '100', 
					memCount: '509', 
					memUsage: '200.13', 
					limit: '2:00:00'
				},
				{
					id: 'lewis',
					name: 'Lewis',
					cpuCount: '24', 
					cpuUsage: '24', 
					memCount: '122', 
					memUsage: '77', 
					limit: '2:00:00'
				}

			],

			accounts: [ 'General', 'elsiklab', 'spencer' ],

			modules: [
				'atk/atk-2.20.0',
				'lammps/lammps-31Mar17',
				'py-faststructure/py-faststructure-1.0',
				'atlas/atlas-3.10.2',
				'lammps/lammps-31Mar17-gpu_sm21',
				'py-funcsigs/py-funcsigs-0.4',
				'autoconf/autoconf-2.69',
				'lammps/lammps-31Mar17-gpu_sm35',
				'py-h5py/py-h5py-2.6.0',
				'autoconf/autoconf-2.69-intel',
				'lammps/lammps-31Mar17-gpu_sm52',
				'py-HTSeq/py-HTSeq-0.6.1',
				'automake/automake-1.15',
				'lcms/lcms-2.6',
				'py-matplotlib/py-matplotlib-1.4.3',
				'automake/automake-1.15-intel',
				'libelf/libelf-0.8.13',
				'py-matplotlib/py-matplotlib-1.5.3',
				'bazel/bazel-0.3.1',
				'libexif/libexif-0.6.21',
				'py-misopy/py-misopy-0.5.3',
				'bcftools/bcftools-1.3.1',
				'libffi/libffi-3.2.1',
				'py-mmtk/py-mmtk-2.6.1',
				'beagle/beagle-lib-2.1.2',
				'libffi/libffi-3.2.1-intel',
				'py-mock/py-mock-1.3.0',
				'bedtools/bedtools-2.25.0',
				'libmng/libmng-2.0.2',
				'py-netcdf/py-netcdf-1.2.3.1',
				'bedtools/bedtools-2.26.0',
				'libpciaccess/libpciaccess-0.13.4',
				'py-nose/py-nose-1.3.7',
				'binutils/binutils-2.27',
				'libpciaccess/libpciaccess-0.13.4-intel',
				'py-numexpr/py-numexpr-2.5',
				'bison/bison-3.0.4',
				'libpng/libpng-1.6.16',
				'py-numpy/py-numpy-1.11.0',
				'bison/bison-3.0.4-intel',
				'libpng/libpng-1.6.24',
				'py-numpy/py-numpy-1.11.2',
				'blat/blat-35',
				'libpng/libpng-1.6.26',
				'py-numpy/py-numpy-1.8.0',
				'boost/boost-1.59.0',
				'libpng/libpng-1.6.26-intel',
				'py-pandas/py-pandas-0.19.1',
				'boost/boost-1.61.0',
				'libpng/libpng-1.6.27',
				'py-pbr/py-pbr-1.8.1',
				'boost/boost-1.62.0',
				'libpthread/libpthread-stubs-0.3',
				'py-phonopy/py-phonopy-1.9.3',
				'bowtie/bowtie-1.1.2',
				'libsigsegv/libsigsegv-2.10',
				'py-phonopy/py-phonopy-1.9.7',
				'bowtie2/bowtie2-2.2.5',
				'libsigsegv/libsigsegv-2.10-intel',
				'py-picrust/py-picrust-1.1.0',
				'bowtie2/bowtie2-2.2.9',
				'libtiff/libtiff-3.9.7',
				'py-pillow/py-pillow-3.2.0',
				'bwa/bwa-0.7.12',
				'libtiff/libtiff-4.0.3',
				'py-platypus/py-platypus-latest',
				'bwa/bwa-0.7.15',
				'libtiff/libtiff-4.0.6',
				'py-pyparsing/py-pyparsing-2.0.3',
				'bzip2/bzip2-1.0.6',
				'libtiff/libtiff-4.0.6-intel',
				'py-pysam/py-pysam-0.9.1.4',
				'bzip2/bzip2-1.0.6-intel',
				'libtool/libtool-2.4.6',
				'py-pytz/py-pytz-2016.3',
				'cairo/cairo-1.14.0',
				'libtool/libtool-2.4.6-intel',
				'py-pytz/py-pytz-2016.6.1',
				'cairo/cairo-1.14.0-intel',
				'libunwind/libunwind-1.1',
				'py-pyyaml/py-pyyaml-3.11',
				'cairo/cairo-1.14.8',
				'libxau/libxau-1.0.8',
				'py-qiime/py-qiime-1.9.1',
				'cmake/cmake-3.6.0',
				'libxcb/libxcb-1.12',
				'py-scientificpython/py-scientificpython-2.9.4',
				'cmake/cmake-3.6.1',
				'libxdmcp/libxdmcp-1.1.2',
				'py-scipy/py-scipy-0.17.0',
				'cmake/cmake-3.6.1-intel',
				'libxml2/libxml2-2.9.2',
				'py-scipy/py-scipy-0.18.1',
				'cmake/cmake-3.7.1',
				'libxml2/libxml2-2.9.4',
				'py-setuptools/py-setuptools-20.7.0',
				'ctffind/ctffind-4.1.8',
				'libxml2/libxml2-2.9.4-intel',
				'py-setuptools/py-setuptools-25.2.0',
				'cufflinks/cufflinks-2.2.1',
				'lumpy-sv/lumpy-sv-0.2.13',
				'py-six/py-six-1.10.0',
				'curl/curl-7.50.1',
				'm4/m4-1.4.17',
				'python/python-2.7.12',
				'curl/curl-7.50.3',
				'm4/m4-1.4.17-intel',
				'python/python-2.7.13',
				'eigen/eigen-3.2.7',
				'mafft/mafft-7.299',
				'python/python-3.5.2',
				'eigen/eigen-3.2.7-intel',
				'makedepend/makedepend-1.0.5',
				'python/python-3.6.0',
				'emboss/emboss-6.6.0',
				'metis/metis-5.1.0',
				'py-virtualenv/py-virtualenv-15.0.1',
				'espresso/espresso-5.4.0',
				'metis/metis-5.1.0-intel',
				'qhull/qhull-2015.2',
				'fftw/fftw-3.3.4',
				'mpc/mpc-1.0.3',
				'qhull/qhull-7.2.0',
				'fftw/fftw-3.3.5',
				'mpfr/mpfr-3.1.4',
				'qmcpack/qmcpack-rev6964_20160602',
				'fftw/fftw-3.3.5-intel',
				'mpfr/mpfr-3.1.4-intel',
				'qt/qt-4.8.6',
				'flex/flex-2.6.0',
				'mpich/mpich-3.2',
				'R/R-3.2.3',
				'flex/flex-2.6.0-intel',
				'mpich/mpich-3.2-intel',
				'R/R-3.3.1',
				'flex/flex-2.6.1',
				'mrsfast/mrsfast-3.3.11',
				'R/R-3.3.3',
				'fltk/fltk-1.3.3',
				'mrsfast/mrsfast-3.4.0',
				'readline/readline-6.3',
				'fontconfig/fontconfig-2.11.1',
				'mummer/mummer-3.23',
				'relion/relion-2.0.3',
				'fontconfig/fontconfig-2.11.1-intel',
				'ncbi-blast/ncbi-blast-2.3.0',
				'relion/relion-2.0.3-gpu',
				'fqtrim/fqtrim-0.9.5',
				'ncbi-ngs/ncbi-ngs-1.3.0',
				'relion/relion-2.0b',
				'freebayes/freebayes-1.1.0',
				'ncurses/ncurses-6.0',
				'relion/relion-2.1.b1',
				'freetype/freetype-2.5.3',
				'ncurses/ncurses-6.0-intel',
				'relion/relion-2.1.b1-gpu',
				'freetype/freetype-2.7',
				'neci/neci-master',
				'root/root-6.06.06',
				'freetype/freetype-2.7-intel',
				'netcdf/netcdf-4.4.1',
				'root/root-6.08.00',
				'gasnet/gasnet-1.24.0',
				'netlib/netlib-lapack-3.6.1',
				'samblaster/samblaster-0.1.24',
				'gcc/gcc-4.9.4',
				'netlib/netlib-scalapack-2.0.2',
				'samtools/samtools-1.2',
				'gcc/gcc-5.4.0',
				'openblas/openblas-0.2.18',
				'samtools/samtools-1.3',
				'gettext/gettext-0.19.8.1',
				'openblas/openblas-0.2.19',
				'samtools/samtools-1.3.1',
				'gettext/gettext-0.19.8.1-intel',
				'openblas/openblas-0.2.19-intel',
				'samtools/samtools-legacy-0.1.19',
				'glib/glib-2.49.4',
				'openbugs/openbugs-3.2.3',
				'scotch/scotch-6.0.3',
				'glib/glib-2.49.4-intel',
				'openmpi/openmpi-1.10.2',
				'scotch/scotch-6.0.3-intel',
				'gmp/gmp-6.1.1',
				'openmpi/openmpi-1.10.3-intel',
				'sdl2/sdl2-2.0.5',
				'gmp/gmp-6.1.1-intel',
				'openmpi/openmpi-2.0.0',
				'sparsehash/sparsehash-2.0.3',
				'gmp/gmp-6.1.2',
				'openmpi/openmpi-2.0.0-intel',
				'sqlite/sqlite-3.8.5',
				'gperftools/gperftools-2.4',
				'openmpi/openmpi-2.0.1',
				'stringtie/stringtie-1.3.3b',
				'gromacs/gromacs-5.1.1',
				'openmpi/openmpi-2.0.1-intel',
				'suite-sparse/suite-sparse-4.5.3',
				'gsl/gsl-2.2.1',
				'openmpi/openmpi-2.1.1',
				'swarm/swarm-1.2.19',
				'gsl/gsl-2.3',
				'openssl/openssl-1.0.2h',
				'tar/tar-1.29',
				'gtkplus/gtkplus-2.24.25',
				'openssl/openssl-1.0.2j',
				'tar/tar-1.29-intel',
				'gtkplus/gtkplus-2.24.31',
				'openssl/openssl-1.0.2j-intel',
				'tbb/tbb-4.4.4',
				'harfbuzz/harfbuzz-0.9.37',
				'pandaseq/pandaseq-2.10',
				'tbb/tbb-4.4.4-intel',
				'hdf5/hdf5-1.10.0-patch1',
				'pango/pango-1.40.1',
				'tcl/tcl-8.6.5',
				'help2man/help2man-1.47.4',
				'pango/pango-1.40.3',
				'tk/tk-8.6.5',
				'hisat2/hisat2-2.0.5',
				'pcre/pcre-8.38',
				'tophat/tophat-2.1.1',
				'hmmer/hmmer-3.1b2',
				'pcre/pcre-8.39',
				'transdecoder/transdecoder-3.0.1',
				'htop/htop-2.0.0',
				'pcre/pcre-8.39-intel',
				'TransDecoder/TransDecoder-2.0.1',
				'htslib/htslib-1.3.1',
				'petsc/petsc-3.6.4',
				'tree/tree-1.7.0',
				'hwloc/hwloc-1.11.3',
				'pigz/pigz-2.3.4',
				'util/util-macros-1.19.0',
				'hwloc/hwloc-1.11.3-intel',
				'pixman/pixman-0.32.6',
				'vcftools/vcftools-v0.1.14',
				'hwloc/hwloc-1.11.4',
				'pixman/pixman-0.34.0',
				'voro/voro-0.4.6',
				'hwloc/hwloc-1.11.4-intel',
				'pixman/pixman-0.34.0-intel',
				'voro/voro-0.4.6-intel',
				'icu/icu-54.1',
				'pkg-config/pkg-config-0.29.1',
				'wx/wx-3.0.1',
				'icu4c/icu4c-57.1',
				'py-ase/py-ase-3.12.0',
				'wx/wx-3.1.0',
				'isl/isl-0.18',
				'py-bottleneck/py-bottleneck-1.0.0',
				'xcb/xcb-proto-1.12',
				'jdk/jdk-8u92-linux',
				'py-cutadapt/py-cutadapt-1.11',
				'xproto/xproto-7.0.29',
				'jellyfish/jellyfish-2.2.6',
				'py-cutadapt/py-cutadapt-1.9.1',
				'xz/xz-5.2.2',
				'jpeg/jpeg-9b',
				'py-cycler/py-cycler-0.10.0',
				'xz/xz-5.2.2-intel',
				'jpeg/jpeg-9b-intel',
				'py-cython/py-cython-0.23.5',
				'zlib/zlib-1.2.10',
				'jq/jq-1.5',
				'py-cython/py-cython-0.25.1',
				'zlib/zlib-1.2.10-intel',
				'kim-api/kim-api-1.7.3',
				'py-cython/py-cython-0.25.2',
				'zlib/zlib-1.2.8',
				'lammps/lammps-30Nov16',
				'py-dateutil/py-dateutil-2.5.2',
				'zlib/zlib-1.2.8-intel',

			],

			emailEvents: ['BEGIN', 'END', 'FAIL', 'REQUEUE', 'TIME_LIMIT']

		},

		job: {
			account: '',
			modules: [],
			partition: 'lewis',
			code: '',
			email: false,
			emailAddr: '',
			emailEvents: '',
		},

		advancedSettings: false,

		editorLang: ['sublime', 'vim', 'emacs'],

		editorOptions: {
			tabSize: 4,
			mode: 'application/x-sh',
			theme: 'base16-dark',
			lineNumbers: true,
			line: true,
			showCursorWhenSelecting: true,
			keyMap: "sublime",
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
			styleSelectedText: true,
			highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
			matchBrackets: true,
		}

	}
  },

  methods: {
  	setSelectedPartition(partition){
  		this.job.partition = partition
  	},
  	getUsagePercent(total, used){
  		return parseInt((used / total) * 100)
  	}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

	h4.page-title {
		text-align: right;
		font-style: italic;
		font-size: 2em;
		color: gray;
		padding-bottom: 10px;
	}

	.partition-card {
		border: 2px solid rgba(0,0,0, 0);
		cursor: pointer;
	}

	.selected-card {
		border: 2px solid rgba(76, 175, 80, 1);
	}

	fieldset {
		border: 1px solid #35689a;
		border-radius: 20px;
	}

	div.input-group__messages div.input-group__hint{
		color: lightslategray;
	}
</style>
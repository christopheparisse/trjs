/****************************************************************************
*
* Name: decim.js
*
* Synopsis:
*
*   Decimates a real or complex signal.  For more information about
*   decimation, see dspGuru's Multirate FAQ at:
*
*       http://www.dspguru.com/info/faqs/mrfaq.htm
*
* Description: See function descriptons below.
*
* by Grant R. Griffin
* Provided by Iowegian's "dspGuru" service (http://www.dspguru.com).
* Copyright 2001, Iowegian International Corporation (http://www.iowegian.com)
*
*                          The Wide Open License (WOL)
*
* Permission to use, copy, modify, distribute and sell this software and its
* documentation for any purpose is hereby granted without fee, provided that
* the above copyright notice and this license appear in all source copies. 
* THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT EXPRESS OR IMPLIED WARRANTY OF
* ANY KIND. See http://www.dspguru.com/wol.htm for more information.
*
* Adapted to javascript by Chritophe Parisse
* 
*****************************************************************************/

/*****************************************************************************
Description:

    decim - "decimates" a signal by changing reducing its sampling rate by an
             integral factor via FIR filtering.

Inputs:

    int factor_M:
        the decimation factor (must be >= 1)

    int H_size:
        the number of taps in the filter : H_size must larger than factor_M

    const double const p_H[]:
        pointer to the array of coefficients for the resampling filter.

Input/Outputs:

    double const p_Z[]:
        pointer to the delay line array (which must have H_size elements if H_size > factor_M)

Inputs:

    int num_inp:
        the number of input samples

    const double inp[]:
        pointer to the input samples

Outputs:

    double out[]:
        pointer to the output sample array.

Returns:
    int num_out:
        pointer to the number of output samples

int decimation(int factor_M, int H_size, const double const p_H[],
           double const p_Z[], int num_inp, const double inp[],
           double out[]);

*****************************************************************************/

'use strict';

trjs.wave.decimation = function(factor_M, H_size, p_H, p_Z, num_inp, inp, out) {
	var tap, num_out;
	var p_inp, p_out;
	var sum;

	var deb=Date.now();
	/* this implementation assumes num_inp is a multiple of factor_M */
	/*
		if (num_inp % factor_M != 0) {
			alert('cannot compute decim with num_imp not multiple of factor_M');
			return -1;
		}
	*/
	// this is not necessary because it is taken into account below (all elements that after the last reduction are ignored)
	// this could be necessary as a ckeck in other situations
	
	/*
	 * initialize the counters and for first element : fill p_Z[]
	 */
	num_out = 0;
	p_inp = 0;
	p_out = 0;
	for ( tap = H_size - 1; tap >= 0; tap--) {
		p_Z[tap] = inp[p_inp].convertToDouble();
		p_inp++;
	}
	p_inp = 0;
	while (num_inp >= factor_M) {
		/* shift Z delay line up to make room for next samples */
		for ( tap = H_size - 1; tap >= factor_M; tap--) {
			p_Z[tap] = p_Z[tap - factor_M];
		}

		/* copy next samples from input buffer to bottom of Z delay line */
		for ( tap = factor_M - 1; tap >= 0; tap--) {
			p_Z[tap] = inp[p_inp].convertToDouble();
			p_inp++;
		}
		num_inp -= factor_M;

		/* calculate FIR sum */
		sum = 0.0;
		for ( tap = 0; tap < H_size; tap++) {
			sum += Math.abs(p_H[tap] * p_Z[tap]);
		}
		if (sum > 1.0) sum = 1.0;
		/* store sum and point to next output */
		out[p_out] = sum;
		p_out++;
		num_out++;
	}

	// console.log('end decim '+(Date.now()-deb));
	return num_out;
	/* pass number of outputs back to caller */
};

trjs.wave.normalize_volume = function(num_inp, inp) {
	var deb=Date.now();
	var max_volume = 0.1;
	var m = 0;
	for (var i=0; i < num_inp; i++) {
		/*
		var s = inp[i];
		if (s<0) {
			if (-s > m) m = -s;
		} else {
			if (s > m) m = s;
		}
		*/
		m += Math.abs(inp[i]);
	}
	m /= num_inp;
	if (m < max_volume) {
		var ratio = max_volume / m;
		for (var i=0; i < num_inp; i++)
			inp[i] = inp[i] * ratio;
	}
	// console.log('normalize '+(Date.now()-deb));
};

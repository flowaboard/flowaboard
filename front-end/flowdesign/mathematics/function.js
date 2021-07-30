import { DesignElement, FlowDesigns, Process, Input, Output } from '../design.js';
import FlowAboard from '../../flowaboard.js'

import esprima from '../../lib/esprima/esprima.js'//'https://cdn.jsdelivr.net/npm/esprima@4.0.1/dist/esprima.min.js'

MathJax = {
    tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] },
    svg: { fontCache: 'global' },
    startup: {
        ready: function () {
            MathJax.startup.defaultReady();
            document.getElementById('render').disabled = false;
        }
    }
}
import 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-svg.js'


class FunctionDesign extends FlowDesigns.ProcessDessign {

}
class FunctionBody extends Process {
    getActiveUi() {
        var div = document.createElement('mathjax-input');
        console.log(MathJax);

        console.log(esprima)
        return div;
    }


    async getFlowUi(parent) {
        if (!this.flowAboard) {
            this.flowAboard = new FlowAboard(parent);
        }
        const flow = await this.flowAboard.load(functionListDesign)
        console.log(flow)
        return flow
    }

    async getUi(status, parent) {
        switch (status) {
            case 'active':
                return await this.getActiveUi(parent)
                break;

            default:

                break;
        }
    }
}
class FunctionInput extends Input {

}
class FunctionOutput extends Output {

}

class FunctionDesignElement extends DesignElement {
    async toFlowly() {
        console.log(this)
        var functionDesign = new FunctionDesign('Function', 'function', `https://en.wikipedia.org/wiki/Function_(mathematics)`)

        functionDesign.add(new FunctionBody('Function', 'function', 'A process or a relation that converts input into output', functionListDesign,
            {
                widthPercentage: 20,
                heightPercentage: 10,
                xPaddingPercentage: 40,
                yPaddingPercentage: 10
            }))
        functionDesign.add(new FunctionInput('x', 'x', 'https://en.wikipedia.org/wiki/Dependent_and_independent_variables', ['function'], null,
            {
                widthPercentage: 10,
                heightPercentage: 10,
                xPaddingPercentage: 100,
                yPaddingPercentage: 50
            }))
        functionDesign.add(new FunctionInput('c', 'c', 'https://en.wikipedia.org/wiki/Dependent_and_independent_variables', ['function'], null,
            {
                widthPercentage: 10,
                heightPercentage: 10,
                xPaddingPercentage: 100,
                yPaddingPercentage: 50
            }))
        functionDesign.add(new FunctionOutput('y', 'y', 'https://en.wikipedia.org/wiki/Dependent_and_independent_variables', ['function'], null,
            {
                widthPercentage: 10,
                heightPercentage: 10,
                xPaddingPercentage: 100,
                yPaddingPercentage: 10
            }))
        return functionDesign;
    }
}

var functionListDesign = new FlowDesigns.ListDesign('List of Functions', 'List_of_functions', `https://en.wikipedia.org/wiki/List_of_mathematical_functions`)
functionListDesign.add(new FunctionDesignElement('Addition', 'Addition', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Addition'));
functionListDesign.add(new FunctionDesignElement('Subtraction', 'Subtraction', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Subtraction'));
functionListDesign.add(new FunctionDesignElement('Multiplication', 'Multiplication', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Multiplication'));
functionListDesign.add(new FunctionDesignElement('Division (mathematics)', 'Division_(mathematics)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Division_(mathematics)'));
functionListDesign.add(new FunctionDesignElement('Variable', 'Variable_(mathematics)', 'https://en.wikipedia.org/wiki/Variable_(mathematics)'));
functionListDesign.add(new FunctionDesignElement('Polynomials', 'Polynomial', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Polynomial'));
functionListDesign.add(new FunctionDesignElement('Constant function', 'Constant_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Constant_function'));
functionListDesign.add(new FunctionDesignElement('Linear function', 'Linear_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Linear_function'));
functionListDesign.add(new FunctionDesignElement('Quadratic function', 'Quadratic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quadratic_function'));
functionListDesign.add(new FunctionDesignElement('parabola', 'Parabola', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Parabola'));
functionListDesign.add(new FunctionDesignElement('Cubic function', 'Cubic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cubic_function'));
functionListDesign.add(new FunctionDesignElement('Quartic function', 'Quartic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quartic_function'));
functionListDesign.add(new FunctionDesignElement('Quintic function', 'Quintic_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quintic_equation'));
functionListDesign.add(new FunctionDesignElement('Sextic function', 'Sextic_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sextic_equation'));
functionListDesign.add(new FunctionDesignElement('Rational functions', 'Rational_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Rational_function'));
functionListDesign.add(new FunctionDesignElement('nth root', 'Nth_root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Nth_root'));
functionListDesign.add(new FunctionDesignElement('Square root', 'Square_root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Square_root'));
functionListDesign.add(new FunctionDesignElement('Cube root', 'Cube_root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cube_root'));
functionListDesign.add(new FunctionDesignElement('Exponential function', 'Exponential_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponential_function'));
functionListDesign.add(new FunctionDesignElement('Hyperbolic functions', 'Hyperbolic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hyperbolic_function'));
//functionListDesign.add(new FunctionDesignElement('Logarithms', 'Logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Logarithm'));
functionListDesign.add(new FunctionDesignElement('Natural logarithm', 'Natural_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Natural_logarithm'));
functionListDesign.add(new FunctionDesignElement('Common logarithm', 'Common_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Common_logarithm'));
functionListDesign.add(new FunctionDesignElement('Binary logarithm', 'Binary_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Binary_logarithm'));
functionListDesign.add(new FunctionDesignElement('Power functions', 'Exponentiation#Power_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponentiation#Power_functions'));
functionListDesign.add(new FunctionDesignElement('Allometric functions', 'Allometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Allometric_function'));
functionListDesign.add(new FunctionDesignElement('Periodic functions', 'Periodic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Periodic_function'));
//functionListDesign.add(new FunctionDesignElement('Trigonometric functions', 'Trigonometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Trigonometric_function'));
functionListDesign.add(new FunctionDesignElement('sine', 'Sine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sine'));
functionListDesign.add(new FunctionDesignElement('cosine', 'Cosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cosine'));
functionListDesign.add(new FunctionDesignElement('tangent', 'Tangent_(trigonometry)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Tangent_(trigonometry)'));
functionListDesign.add(new FunctionDesignElement('cotangent', 'Cotangent', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cotangent'));
functionListDesign.add(new FunctionDesignElement('secant', 'Secant_(trigonometry)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Secant_(trigonometry)'));
functionListDesign.add(new FunctionDesignElement('cosecant', 'Cosecant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cosecant'));
functionListDesign.add(new FunctionDesignElement('exsecant', 'Exsecant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exsecant'));
functionListDesign.add(new FunctionDesignElement('excosecant', 'Excosecant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Excosecant'));
functionListDesign.add(new FunctionDesignElement('versine', 'Versine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Versine'));
functionListDesign.add(new FunctionDesignElement('coversine', 'Coversine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Coversine'));
functionListDesign.add(new FunctionDesignElement('vercosine', 'Vercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Vercosine'));
functionListDesign.add(new FunctionDesignElement('covercosine', 'Covercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Covercosine'));
functionListDesign.add(new FunctionDesignElement('haversine', 'Haversine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Haversine'));
functionListDesign.add(new FunctionDesignElement('hacoversine', 'Hacoversine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hacoversine'));
functionListDesign.add(new FunctionDesignElement('havercosine', 'Havercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Havercosine'));
functionListDesign.add(new FunctionDesignElement('hacovercosine', 'Hacovercosine', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hacovercosine'));
functionListDesign.add(new FunctionDesignElement('Gudermannian function', 'Gudermannian_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Gudermannian_function'));
functionListDesign.add(new FunctionDesignElement('Indicator function', 'Indicator_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Indicator_function'));
functionListDesign.add(new FunctionDesignElement('Step function', 'Step_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Step_function'));
functionListDesign.add(new FunctionDesignElement('linear combination', 'Linear_combination', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Linear_combination'));
functionListDesign.add(new FunctionDesignElement('indicator functions', 'Indicator_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Indicator_function'));
functionListDesign.add(new FunctionDesignElement('half-open intervals', 'Half-open_interval', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Half-open_interval'));
functionListDesign.add(new FunctionDesignElement('Heaviside step function', 'Heaviside_step_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Heaviside_step_function'));
functionListDesign.add(new FunctionDesignElement('Dirac delta function', 'Dirac_delta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirac_delta_function'));
functionListDesign.add(new FunctionDesignElement('Sawtooth wave', 'Sawtooth_wave', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sawtooth_wave'));
functionListDesign.add(new FunctionDesignElement('Square wave', 'Square_wave', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Square_wave'));
functionListDesign.add(new FunctionDesignElement('Triangle wave', 'Triangle_wave', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Triangle_wave'));
functionListDesign.add(new FunctionDesignElement('Floor function', 'Floor_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Floor_function'));
functionListDesign.add(new FunctionDesignElement('Ceiling function', 'Ceiling_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Ceiling_function'));
functionListDesign.add(new FunctionDesignElement('Sign function', 'Sign_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sign_function'));
functionListDesign.add(new FunctionDesignElement('Absolute value', 'Absolute_value', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Absolute_value'));
functionListDesign.add(new FunctionDesignElement('Sigma function', 'Divisor_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Divisor_function'));
functionListDesign.add(new FunctionDesignElement('Sums', 'Summation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Summation'));
functionListDesign.add(new FunctionDesignElement('powers', 'Exponentiation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponentiation'));
functionListDesign.add(new FunctionDesignElement('divisors', 'Divisor', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Divisor'));
functionListDesign.add(new FunctionDesignElement('natural number', 'Natural_number', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Natural_number'));
functionListDesign.add(new FunctionDesignElement('Euler\'s totient function', 'Euler%27s_totient_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Euler%27s_totient_function'));
functionListDesign.add(new FunctionDesignElement('coprime', 'Coprime', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Coprime'));
functionListDesign.add(new FunctionDesignElement('Prime-counting function', 'Prime-counting_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Prime-counting_function'));
functionListDesign.add(new FunctionDesignElement('primes', 'Prime_number', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Prime_number'));
functionListDesign.add(new FunctionDesignElement('Partition function', 'Partition_function_(number_theory)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Partition_function_(number_theory)'));
functionListDesign.add(new FunctionDesignElement('Möbius μ function', 'M%C3%B6bius_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/M%C3%B6bius_function'));
functionListDesign.add(new FunctionDesignElement('Logarithmic integral function', 'Logarithmic_integral_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Logarithmic_integral_function'));
functionListDesign.add(new FunctionDesignElement('prime number theorem', 'Prime_number_theorem', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Prime_number_theorem'));
functionListDesign.add(new FunctionDesignElement('Exponential integral', 'Exponential_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Exponential_integral'));
functionListDesign.add(new FunctionDesignElement('Trigonometric integral', 'Trigonometric_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Trigonometric_integral'));
functionListDesign.add(new FunctionDesignElement('Error function', 'Error_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Error_function'));
functionListDesign.add(new FunctionDesignElement('normal random variables', 'Normal_distribution', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Normal_distribution'));
functionListDesign.add(new FunctionDesignElement('Fresnel integral', 'Fresnel_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Fresnel_integral'));
functionListDesign.add(new FunctionDesignElement('optics', 'Optics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Optics'));
functionListDesign.add(new FunctionDesignElement('Dawson function', 'Dawson_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dawson_function'));
functionListDesign.add(new FunctionDesignElement('probability', 'Probability', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Probability'));
functionListDesign.add(new FunctionDesignElement('Faddeeva function', 'Faddeeva_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Faddeeva_function'));
functionListDesign.add(new FunctionDesignElement('Gamma function', 'Gamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Gamma_function'));
functionListDesign.add(new FunctionDesignElement('factorial', 'Factorial', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Factorial'));
functionListDesign.add(new FunctionDesignElement('Barnes G-function', 'Barnes_G-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Barnes_G-function'));
functionListDesign.add(new FunctionDesignElement('Beta function', 'Beta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Beta_function'));
functionListDesign.add(new FunctionDesignElement('binomial coefficient', 'Binomial_coefficient', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Binomial_coefficient'));
functionListDesign.add(new FunctionDesignElement('Digamma function', 'Digamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Digamma_function'));
functionListDesign.add(new FunctionDesignElement('Polygamma function', 'Polygamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Polygamma_function'));
functionListDesign.add(new FunctionDesignElement('Incomplete beta function', 'Incomplete_beta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_beta_function'));
functionListDesign.add(new FunctionDesignElement('Incomplete gamma function', 'Incomplete_gamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_gamma_function'));
functionListDesign.add(new FunctionDesignElement('K-function', 'K-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/K-function'));
functionListDesign.add(new FunctionDesignElement('Multivariate gamma function', 'Multivariate_gamma_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Multivariate_gamma_function'));
functionListDesign.add(new FunctionDesignElement('multivariate statistics', 'Multivariate_statistics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Multivariate_statistics'));
functionListDesign.add(new FunctionDesignElement('Student\'s t-distribution', 'Student%27s_t-distribution', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Student%27s_t-distribution'));
functionListDesign.add(new FunctionDesignElement('Pi function', 'Gamma_function#Pi_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Gamma_function#Pi_function'));
functionListDesign.add(new FunctionDesignElement('Elliptic integrals', 'Elliptic_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Elliptic_integral'));
functionListDesign.add(new FunctionDesignElement('ellipses', 'Ellipse', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Ellipse'));
functionListDesign.add(new FunctionDesignElement('quarter period', 'Quarter_period', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Quarter_period'));
functionListDesign.add(new FunctionDesignElement('nome', 'Nome_(mathematics)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Nome_(mathematics)'));
functionListDesign.add(new FunctionDesignElement('Carlson symmetric form', 'Carlson_symmetric_form', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Carlson_symmetric_form'));
functionListDesign.add(new FunctionDesignElement('Legendre form', 'Legendre_form', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Legendre_form'));
functionListDesign.add(new FunctionDesignElement('Elliptic functions', 'Elliptic_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Elliptic_function'));
functionListDesign.add(new FunctionDesignElement('Weierstrass\'s elliptic functions', 'Weierstrass%27s_elliptic_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Weierstrass%27s_elliptic_functions'));
functionListDesign.add(new FunctionDesignElement('Jacobi\'s elliptic functions', 'Jacobi%27s_elliptic_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Jacobi%27s_elliptic_functions'));
functionListDesign.add(new FunctionDesignElement('sine lemniscate', 'Sine_lemniscate', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sine_lemniscate'));
functionListDesign.add(new FunctionDesignElement('cosine lemniscate', 'Cosine_lemniscate', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Cosine_lemniscate'));
functionListDesign.add(new FunctionDesignElement('Theta function', 'Theta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Theta_function'));
functionListDesign.add(new FunctionDesignElement('modular forms', 'Modular_form', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Modular_form'));
functionListDesign.add(new FunctionDesignElement('J-invariant', 'J-invariant', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/J-invariant'));
functionListDesign.add(new FunctionDesignElement('Dedekind eta function', 'Dedekind_eta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dedekind_eta_function'));
functionListDesign.add(new FunctionDesignElement('Airy function', 'Airy_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Airy_function'));
functionListDesign.add(new FunctionDesignElement('Bessel functions', 'Bessel_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Bessel_function'));
functionListDesign.add(new FunctionDesignElement('differential equation', 'Differential_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Differential_equation'));
functionListDesign.add(new FunctionDesignElement('astronomy', 'Astronomy', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Astronomy'));
functionListDesign.add(new FunctionDesignElement('electromagnetism', 'Electromagnetism', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Electromagnetism'));
functionListDesign.add(new FunctionDesignElement('mechanics', 'Mechanics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Mechanics'));
functionListDesign.add(new FunctionDesignElement('Bessel–Clifford function', 'Bessel%E2%80%93Clifford_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Bessel%E2%80%93Clifford_function'));
functionListDesign.add(new FunctionDesignElement('Kelvin functions', 'Kelvin_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Kelvin_functions'));
functionListDesign.add(new FunctionDesignElement('Legendre function', 'Legendre_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Legendre_function'));
functionListDesign.add(new FunctionDesignElement('spherical harmonics', 'Spherical_harmonics', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Spherical_harmonics'));
functionListDesign.add(new FunctionDesignElement('Scorer\'s function', 'Scorer%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Scorer%27s_function'));
functionListDesign.add(new FunctionDesignElement('Sinc function', 'Sinc_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Sinc_function'));
functionListDesign.add(new FunctionDesignElement('Hermite polynomials', 'Hermite_polynomials', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hermite_polynomials'));
functionListDesign.add(new FunctionDesignElement('Laguerre polynomials', 'Laguerre_polynomials', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Laguerre_polynomials'));
functionListDesign.add(new FunctionDesignElement('Chebyshev polynomials', 'Chebyshev_polynomials', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Chebyshev_polynomials'));
functionListDesign.add(new FunctionDesignElement('Riemann zeta function', 'Riemann_zeta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riemann_zeta_function'));
functionListDesign.add(new FunctionDesignElement('Dirichlet series', 'Dirichlet_series', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_series'));
functionListDesign.add(new FunctionDesignElement('Riemann Xi function', 'Riemann_Xi_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riemann_Xi_function'));
functionListDesign.add(new FunctionDesignElement('Dirichlet eta function', 'Dirichlet_eta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_eta_function'));
functionListDesign.add(new FunctionDesignElement('Dirichlet beta function', 'Dirichlet_beta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_beta_function'));
functionListDesign.add(new FunctionDesignElement('Dirichlet L-function', 'Dirichlet_L-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_L-function'));
functionListDesign.add(new FunctionDesignElement('Hurwitz zeta function', 'Hurwitz_zeta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hurwitz_zeta_function'));
functionListDesign.add(new FunctionDesignElement('Legendre chi function', 'Legendre_chi_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Legendre_chi_function'));
functionListDesign.add(new FunctionDesignElement('Lerch transcendent', 'Lerch_transcendent', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Lerch_transcendent'));
functionListDesign.add(new FunctionDesignElement('Polylogarithm', 'Polylogarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Polylogarithm'));
functionListDesign.add(new FunctionDesignElement('Incomplete polylogarithm', 'Incomplete_polylogarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_polylogarithm'));
functionListDesign.add(new FunctionDesignElement('Clausen function', 'Clausen_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Clausen_function'));
functionListDesign.add(new FunctionDesignElement('Complete Fermi–Dirac integral', 'Complete_Fermi%E2%80%93Dirac_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Complete_Fermi%E2%80%93Dirac_integral'));
functionListDesign.add(new FunctionDesignElement('Incomplete Fermi–Dirac integral', 'Incomplete_Fermi%E2%80%93Dirac_integral', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Incomplete_Fermi%E2%80%93Dirac_integral'));
functionListDesign.add(new FunctionDesignElement('Kummer\'s function', 'Kummer%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Kummer%27s_function'));
functionListDesign.add(new FunctionDesignElement('Spence\'s function', 'Spence%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Spence%27s_function'));
functionListDesign.add(new FunctionDesignElement('Riesz function', 'Riesz_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riesz_function'));
functionListDesign.add(new FunctionDesignElement('Hypergeometric functions', 'Hypergeometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hypergeometric_function'));
functionListDesign.add(new FunctionDesignElement('power series', 'Power_series', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Power_series'));
functionListDesign.add(new FunctionDesignElement('Confluent hypergeometric function', 'Confluent_hypergeometric_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Confluent_hypergeometric_function'));
functionListDesign.add(new FunctionDesignElement('Associated Legendre functions', 'Associated_Legendre_functions', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Associated_Legendre_functions'));
functionListDesign.add(new FunctionDesignElement('Meijer G-function', 'Meijer_G-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Meijer_G-function'));
functionListDesign.add(new FunctionDesignElement('Fox H-function', 'Fox_H-function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Fox_H-function'));
functionListDesign.add(new FunctionDesignElement('Hyper operators', 'Hyper_operator', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Hyper_operator'));
functionListDesign.add(new FunctionDesignElement('Iterated logarithm', 'Iterated_logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Iterated_logarithm'));
functionListDesign.add(new FunctionDesignElement('Pentation', 'Pentation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Pentation'));
functionListDesign.add(new FunctionDesignElement('Super-logarithms', 'Super-logarithm', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Super-logarithm'));
functionListDesign.add(new FunctionDesignElement('Super-roots', 'Super-root', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Super-root'));
functionListDesign.add(new FunctionDesignElement('Tetration', 'Tetration', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Tetration'));
functionListDesign.add(new FunctionDesignElement('Lambert W function', 'Lambert_W_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Lambert_W_function'));
functionListDesign.add(new FunctionDesignElement('Riemann zeta function', 'Riemann_zeta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Riemann_zeta_function'));
functionListDesign.add(new FunctionDesignElement('Liouville function', 'Liouville_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Liouville_function'));
functionListDesign.add(new FunctionDesignElement('Von Mangoldt function', 'Von_Mangoldt_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Von_Mangoldt_function'));
functionListDesign.add(new FunctionDesignElement('Modular lambda function', 'Modular_lambda_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Modular_lambda_function'));
functionListDesign.add(new FunctionDesignElement('Lamé function', 'Lam%C3%A9_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Lam%C3%A9_function'));
functionListDesign.add(new FunctionDesignElement('Mathieu function', 'Mathieu_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Mathieu_function'));
functionListDesign.add(new FunctionDesignElement('Mittag-Leffler function', 'Mittag-Leffler_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Mittag-Leffler_function'));
functionListDesign.add(new FunctionDesignElement('Painlevé transcendents', 'Painlev%C3%A9_transcendents', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Painlev%C3%A9_transcendents'));
functionListDesign.add(new FunctionDesignElement('Parabolic cylinder function', 'Parabolic_cylinder_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Parabolic_cylinder_function'));
functionListDesign.add(new FunctionDesignElement('Synchrotron function', 'Synchrotron_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Synchrotron_function'));
functionListDesign.add(new FunctionDesignElement('Arithmetic–geometric mean', 'Arithmetic%E2%80%93geometric_mean', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Arithmetic%E2%80%93geometric_mean'));
functionListDesign.add(new FunctionDesignElement('Ackermann function', 'Ackermann_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Ackermann_function'));
functionListDesign.add(new FunctionDesignElement('theory of computation', 'Theory_of_computation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Theory_of_computation'));
functionListDesign.add(new FunctionDesignElement('computable function', 'Computable_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Computable_function'));
functionListDesign.add(new FunctionDesignElement('primitive recursive', 'Primitive_recursive_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Primitive_recursive_function'));
functionListDesign.add(new FunctionDesignElement('Böttcher\'s function', 'B%C3%B6ttcher%27s_equation', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/B%C3%B6ttcher%27s_equation'));
functionListDesign.add(new FunctionDesignElement('Dirac delta function', 'Dirac_delta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirac_delta_function'));
functionListDesign.add(new FunctionDesignElement('distribution', 'Distribution_(mathematics)', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Distribution_(mathematics)'));
functionListDesign.add(new FunctionDesignElement('Dirichlet function', 'Dirichlet_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Dirichlet_function'));
functionListDesign.add(new FunctionDesignElement('indicator function', 'Indicator_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Indicator_function'));
functionListDesign.add(new FunctionDesignElement('nowhere continuous', 'Nowhere_continuous', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Nowhere_continuous'));
functionListDesign.add(new FunctionDesignElement('Thomae\'s function', 'Thomae%27s_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Thomae%27s_function'));
functionListDesign.add(new FunctionDesignElement('Kronecker delta function', 'Kronecker_delta_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Kronecker_delta_function'));
functionListDesign.add(new FunctionDesignElement('Minkowski\'s question mark function', 'Minkowski%27s_question_mark_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Minkowski%27s_question_mark_function'));
functionListDesign.add(new FunctionDesignElement('Weierstrass function', 'Weierstrass_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Weierstrass_function'));
functionListDesign.add(new FunctionDesignElement('continuous function', 'Continuous_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Continuous_function'));
functionListDesign.add(new FunctionDesignElement('differentiable', 'Differentiable_function', 'https://en.wikipedia.org/https://en.wikipedia.org/wiki/Differentiable_function'));
functionListDesign.flowConfig = {
    action: {
        "click": "flow"
    },
    flex: true,
    feWidthPercentage: 40,
    feHeightPercentage: 20,
    fexPaddingPercentage: 5,
    feyPaddingPercentage: 5
}

export default functionListDesign;